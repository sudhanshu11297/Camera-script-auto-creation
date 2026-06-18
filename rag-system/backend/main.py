from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from rag_engine import RAGEngine

app = FastAPI(title="RAG Search Engine", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG engine
rag_engine = RAGEngine()

class QueryRequest(BaseModel):
    query: str

class DocumentList(BaseModel):
    documents: List[str]

@app.get("/")
async def root():
    return {"message": "RAG Search Engine API", "version": "1.0.0"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and index a text document"""
    try:
        # Read file content
        content = await file.read()
        text_content = content.decode("utf-8")
        
        # Add to RAG engine
        result = rag_engine.add_document(file.filename, text_content)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/search")
async def search(request: QueryRequest):
    """Search for documents"""
    try:
        results = rag_engine.search(request.query)
        return {
            "query": request.query,
            "results": [
                {"content": content[:200] + "..." if len(content) > 200 else content, 
                 "distance": distance}
                for content, distance in results
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/query")
async def query(request: QueryRequest):
    """Query with RAG - returns generated answer"""
    try:
        result = rag_engine.generate_answer(request.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/documents")
async def list_documents():
    """List all indexed documents"""
    try:
        documents = rag_engine.list_documents()
        return {"documents": documents, "total": len(documents)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/documents/{filename}")
async def delete_document(filename: str):
    """Delete a document from the index"""
    try:
        result = rag_engine.delete_document(filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
