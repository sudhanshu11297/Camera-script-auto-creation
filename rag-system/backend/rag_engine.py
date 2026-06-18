import os
import json
import pickle
from typing import List, Tuple
import numpy as np
from openai import OpenAI
import faiss
from pathlib import Path
from config import (
    OPENAI_API_KEY, FAISS_INDEX_PATH, DATA_PATH, 
    EMBEDDING_MODEL, CHUNK_SIZE, CHUNK_OVERLAP, MAX_RESULTS, MODEL_NAME
)

client = OpenAI(api_key=OPENAI_API_KEY)

class RAGEngine:
    def __init__(self):
        self.index = None
        self.documents = []
        self.embeddings = None
        self.index_path = FAISS_INDEX_PATH
        self.metadata_path = f"{FAISS_INDEX_PATH}_metadata.json"
        self.embeddings_path = f"{FAISS_INDEX_PATH}_embeddings.pkl"
        self.load_index()

    def chunk_document(self, text: str) -> List[str]:
        """Split document into overlapping chunks"""
        chunks = []
        for i in range(0, len(text), CHUNK_SIZE - CHUNK_OVERLAP):
            chunk = text[i:i + CHUNK_SIZE]
            if len(chunk.strip()) > 0:
                chunks.append(chunk)
        return chunks

    def get_embeddings(self, texts: List[str]) -> np.ndarray:
        """Get embeddings from OpenAI API"""
        response = client.embeddings.create(
            input=texts,
            model=EMBEDDING_MODEL
        )
        return np.array([item.embedding for item in response.data])

    def add_document(self, filename: str, content: str) -> dict:
        """Add a new document to the index"""
        # Chunk the document
        chunks = self.chunk_document(content)
        
        if not chunks:
            return {"error": "Document is too small or empty"}

        # Get embeddings
        embeddings = self.get_embeddings(chunks)
        
        # Initialize index if needed
        if self.index is None:
            embedding_dim = embeddings.shape[1]
            self.index = faiss.IndexFlatL2(embedding_dim)
            self.embeddings = embeddings
        else:
            self.embeddings = np.vstack([self.embeddings, embeddings])
        
        # Add to FAISS
        self.index.add(embeddings.astype(np.float32))
        
        # Store metadata
        for i, chunk in enumerate(chunks):
            self.documents.append({
                "filename": filename,
                "chunk_index": i,
                "content": chunk,
                "embedding_index": len(self.documents)
            })
        
        # Save index
        self.save_index()
        
        return {
            "status": "success",
            "filename": filename,
            "chunks_created": len(chunks),
            "total_documents": len(self.documents)
        }

    def search(self, query: str, top_k: int = MAX_RESULTS) -> List[Tuple[str, float]]:
        """Search for relevant documents"""
        if self.index is None:
            return []
        
        # Get query embedding
        query_embedding = self.get_embeddings([query])
        
        # Search in FAISS
        distances, indices = self.index.search(
            query_embedding.astype(np.float32), 
            min(top_k, len(self.documents))
        )
        
        results = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx < len(self.documents):
                doc = self.documents[idx]
                results.append((doc["content"], float(distance)))
        
        return results

    def generate_answer(self, query: str) -> dict:
        """Generate answer using RAG"""
        # Get relevant documents
        relevant_docs = self.search(query)
        
        if not relevant_docs:
            return {
                "answer": "No relevant documents found.",
                "sources": []
            }
        
        # Prepare context
        context = "\n\n".join([doc[0] for doc in relevant_docs])
        sources = list(set([self.documents[i]["filename"] for doc in relevant_docs 
                           for i in range(len(self.documents)) 
                           if self.documents[i]["content"] == doc[0]]))
        
        # Generate response using GPT
        prompt = f"""Based on the following context, answer the query:

Context:
{context}

Query: {query}

Answer:"""
        
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Answer based on the provided context."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        return {
            "answer": response.choices[0].message.content,
            "sources": sources,
            "relevant_chunks": len(relevant_docs)
        }

    def save_index(self):
        """Save FAISS index to disk"""
        os.makedirs(os.path.dirname(self.index_path) or ".", exist_ok=True)
        
        if self.index is not None:
            faiss.write_index(self.index, self.index_path)
        
        # Save metadata
        with open(self.metadata_path, "w") as f:
            json.dump(self.documents, f)
        
        # Save embeddings
        if self.embeddings is not None:
            with open(self.embeddings_path, "wb") as f:
                pickle.dump(self.embeddings, f)

    def load_index(self):
        """Load FAISS index from disk"""
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
        
        if os.path.exists(self.metadata_path):
            with open(self.metadata_path, "r") as f:
                self.documents = json.load(f)
        
        if os.path.exists(self.embeddings_path):
            with open(self.embeddings_path, "rb") as f:
                self.embeddings = pickle.load(f)

    def list_documents(self) -> List[str]:
        """List all indexed documents"""
        return list(set([doc["filename"] for doc in self.documents]))

    def delete_document(self, filename: str) -> dict:
        """Delete a document from the index"""
        # Find indices to delete
        indices_to_keep = [i for i, doc in enumerate(self.documents) 
                          if doc["filename"] != filename]
        
        if len(indices_to_keep) == len(self.documents):
            return {"error": "Document not found"}
        
        # Rebuild index without the deleted document
        if indices_to_keep:
            self.documents = [self.documents[i] for i in indices_to_keep]
            self.embeddings = self.embeddings[indices_to_keep]
            
            # Rebuild FAISS index
            embedding_dim = self.embeddings.shape[1]
            self.index = faiss.IndexFlatL2(embedding_dim)
            self.index.add(self.embeddings.astype(np.float32))
        else:
            self.index = None
            self.documents = []
            self.embeddings = None
        
        self.save_index()
        return {"status": "success", "filename": filename}
