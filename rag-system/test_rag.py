"""
Quick test script to verify RAG system works correctly
"""

import os
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from rag_engine import RAGEngine

def test_rag():
    print("🧪 Testing RAG System...")
    
    try:
        # Initialize RAG
        print("\n1. Initializing RAG Engine...")
        rag = RAGEngine()
        print("   ✓ RAG Engine initialized")
        
        # Load sample documents
        print("\n2. Loading sample documents...")
        data_path = os.path.join(os.path.dirname(__file__), 'data')
        
        for filename in os.listdir(data_path):
            if filename.endswith('.txt'):
                filepath = os.path.join(data_path, filename)
                with open(filepath, 'r') as f:
                    content = f.read()
                result = rag.add_document(filename, content)
                print(f"   ✓ Added {filename}: {result['chunks_created']} chunks")
        
        # Test search
        print("\n3. Testing search...")
        query = "What is machine learning?"
        results = rag.search(query)
        print(f"   ✓ Search completed: {len(results)} results found")
        
        # List documents
        print("\n4. Listing indexed documents...")
        docs = rag.list_documents()
        print(f"   ✓ {len(docs)} documents indexed")
        for doc in docs:
            print(f"     - {doc}")
        
        print("\n✅ All tests passed!")
        print("\nTo start using the RAG system:")
        print("1. python backend/main.py  # Start the API server")
        print("2. Open http://localhost:8000/docs  # View API documentation")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("Make sure you have set OPENAI_API_KEY in backend/.env")
        sys.exit(1)

if __name__ == "__main__":
    test_rag()
