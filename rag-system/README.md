# RAG Search Engine

A complete Retrieval-Augmented Generation (RAG) system built with Python (FastAPI), OpenAI, FAISS, and React. Search and query your documents with AI-powered answers.

## Features

✨ **Document Management**
- Upload text files (.txt, .md)
- Automatic chunking and embedding
- Real-time document indexing
- Delete documents from index

🔍 **Intelligent Search**
- Semantic search using FAISS
- RAG-powered answer generation with OpenAI GPT
- Source attribution
- Fast vector similarity search

🎨 **Modern UI**
- Beautiful React interface
- Real-time feedback
- Responsive design
- Two modes: Search and Document Management

🚀 **Production Ready**
- CORS enabled for frontend integration
- RESTful API endpoints
- Health check endpoint
- Error handling

## Project Structure

```
rag-system/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── rag_engine.py        # RAG logic with FAISS
│   ├── config.py            # Configuration settings
│   ├── requirements.txt      # Python dependencies
│   └── .env.example         # Environment variables template
├── frontend/
│   ├── RAGSearch.jsx        # React component
│   └── RAGSearch.css        # Styling
├── data/                    # Document storage
└── README.md               # This file
```

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd rag-system/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Add your OpenAI API key to .env
# OPENAI_API_KEY=sk-...
```

### 2. Start Backend Server

```bash
# Make sure you're in the backend directory with venv activated
python main.py
```

The API will be available at `http://localhost:8000`

API Endpoints:
- `GET /` - Health check
- `POST /upload` - Upload document
- `POST /search` - Search documents
- `POST /query` - Query with RAG (get AI-generated answer)
- `GET /documents` - List all documents
- `DELETE /documents/{filename}` - Delete document
- `GET /health` - Health status

### 3. Frontend Integration

Copy the React component to your existing React project:

```bash
# Copy files to your React project
cp rag-system/frontend/RAGSearch.jsx your-react-project/src/components/
cp rag-system/frontend/RAGSearch.css your-react-project/src/components/
```

Then import in your React app:

```jsx
import RAGSearch from './components/RAGSearch';

function App() {
  return <RAGSearch />;
}
```

## API Examples

### Upload a Document

```bash
curl -X POST -F "file=@document.txt" http://localhost:8000/upload
```

Response:
```json
{
  "status": "success",
  "filename": "document.txt",
  "chunks_created": 10,
  "total_documents": 10
}
```

### Search Documents

```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "What is machine learning?"}'
```

### Query with RAG

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain the main concepts"}'
```

Response:
```json
{
  "answer": "Based on the provided documents...",
  "sources": ["document1.txt", "document2.txt"],
  "relevant_chunks": 3
}
```

## Configuration

Edit `backend/config.py` to customize:

```python
MODEL_NAME = "gpt-3.5-turbo"              # GPT model
EMBEDDING_MODEL = "text-embedding-3-small" # Embedding model
CHUNK_SIZE = 500                           # Document chunk size
CHUNK_OVERLAP = 50                         # Overlap between chunks
MAX_RESULTS = 5                            # Max search results
```

## Real-time Document Updates

The system supports real-time document updates:
- Upload new documents anytime
- Existing index updates automatically
- Search includes new documents immediately
- Delete documents to remove from index

## Performance Tips

1. **Batch Uploads**: For large document sets, upload in batches
2. **Chunk Size**: Adjust `CHUNK_SIZE` based on your data
3. **Embeddings**: Use `text-embedding-3-small` for speed, `text-embedding-3-large` for accuracy
4. **FAISS Index**: Automatically saved after each operation

## Troubleshooting

### "OPENAI_API_KEY not found"
- Ensure `.env` file exists in `backend/` directory
- Add your OpenAI API key to `.env`

### CORS errors
- Backend CORS is enabled by default
- Make sure frontend is accessing `http://localhost:8000`

### "No commits yet" when pushing
- Index is built on first document upload
- Upload at least one document before querying

## Environment Variables

```bash
OPENAI_API_KEY=your_api_key_here
FAISS_INDEX_PATH=./faiss_index
DATA_PATH=../data
```

## Sample Documents

Place sample `.txt` files in `rag-system/data/` directory:

```
rag-system/data/
├── sample1.txt
├── sample2.txt
└── sample3.txt
```

## Next Steps

1. ✅ Set up backend with your OpenAI API key
2. ✅ Start the server: `python main.py`
3. ✅ Upload sample documents via the API
4. ✅ Integrate React component into your app
5. ✅ Start querying!

## License

MIT

## Support

For issues or questions, check the API logs or ensure:
- OpenAI API key is valid
- Python version is 3.8+
- All dependencies are installed
- Port 8000 is available
