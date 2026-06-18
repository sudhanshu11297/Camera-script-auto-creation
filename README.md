# 🤖 RAG AI - Intelligent Document Search & Test Generation

> **Retrieval-Augmented Generation (RAG) powered Search Engine + Intelligent Test Case Generator**

A production-ready AI system combining semantic document search with automatic test case generation. Built with Python, OpenAI, FAISS, and React.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-brightgreen.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.104-brightgreen.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/react-18-blue.svg)](https://react.dev/)

---

## ✨ Features

### 🔍 **RAG Search Engine**
- Semantic document search using FAISS vector database
- AI-powered answer generation with OpenAI GPT-3.5-turbo
- Real-time document indexing and updates
- Source attribution for all answers
- Support for real-time document uploads/deletions
- Production-ready REST API

### 📝 **Test Case Generator**
- Auto-generate test cases from requirements
- Intelligent test scenario extraction
- Integration with RAG for requirement analysis
- Configurable test templates

### 🎨 **Modern UI**
- Beautiful React frontend for RAG
- Real-time feedback and updates
- Responsive, mobile-friendly design
- Two-mode interface: Search & Document Management

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- OpenAI API key (get it [here](https://platform.openai.com/account/api-keys))
- Node.js 14+ (for React frontend)

### 1. Clone & Setup Backend

```bash
cd rag-system/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### 2. Start Backend Server

```bash
# Make sure venv is activated
python main.py
```

API will be available at: `http://localhost:8000`
Interactive docs: `http://localhost:8000/docs`

### 3. Integrate React Frontend

```bash
# Copy to your React project
cp rag-system/frontend/RAGSearch.jsx your-project/src/components/
cp rag-system/frontend/RAGSearch.css your-project/src/components/
```

Then import:
```jsx
import RAGSearch from './components/RAGSearch';

export default function App() {
  return <RAGSearch />;
}
```

---

## 📚 Project Structure

```
.
├── rag-system/
│   ├── backend/
│   │   ├── main.py                 # FastAPI application
│   │   ├── rag_engine.py           # RAG logic & FAISS integration
│   │   ├── config.py               # Configuration
│   │   ├── requirements.txt        # Python dependencies
│   │   └── .env.example            # Environment template
│   ├── frontend/
│   │   ├── RAGSearch.jsx           # React component
│   │   └── RAGSearch.css           # Styling
│   ├── data/
│   │   ├── sample1.txt             # Sample documents
│   │   └── sample2.txt
│   ├── test_rag.py                 # Test script
│   ├── setup.sh                    # Setup script
│   └── README.md                   # Detailed RAG docs
│
├── index.jsx                       # Main app
├── .env                           # (Don't commit)
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

---

## 🔌 API Endpoints

### Document Management
```bash
# Upload document
POST /upload
Content-Type: multipart/form-data
Body: file (txt/md/pdf)

# List documents
GET /documents

# Delete document
DELETE /documents/{filename}
```

### Search & Query
```bash
# Search for relevant documents
POST /search
Content-Type: application/json
Body: { "query": "What is machine learning?" }

# Query with RAG (AI-generated answer)
POST /query
Content-Type: application/json
Body: { "query": "What is machine learning?" }
```

### Health
```bash
# Health check
GET /health
GET /
```

---

## 📖 Usage Examples

### Upload Document

```bash
curl -X POST -F "file=@document.txt" http://localhost:8000/upload
```

Response:
```json
{
  "status": "success",
  "filename": "document.txt",
  "chunks_created": 12,
  "total_documents": 12
}
```

### Query with RAG

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is artificial intelligence?"}'
```

Response:
```json
{
  "answer": "Artificial intelligence is a branch of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence...",
  "sources": ["document.txt"],
  "relevant_chunks": 3
}
```

### Search Documents

```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "machine learning algorithms"}'
```

---

## ⚙️ Configuration

Edit `rag-system/backend/config.py`:

```python
MODEL_NAME = "gpt-3.5-turbo"              # OpenAI model
EMBEDDING_MODEL = "text-embedding-3-small" # Embeddings
CHUNK_SIZE = 500                           # Document chunk size
CHUNK_OVERLAP = 50                         # Chunk overlap
MAX_RESULTS = 5                            # Max search results
```

Environment Variables (`.env`):
```
OPENAI_API_KEY=sk-...                # Your OpenAI API key
FAISS_INDEX_PATH=./faiss_index       # Index storage path
DATA_PATH=../data                    # Documents directory
```

---

## 🎯 How It Works

### RAG Pipeline

```
1. UPLOAD
   File → Split into chunks → Create embeddings → Store in FAISS

2. SEARCH
   Query → Create query embedding → Find similar chunks (FAISS)

3. GENERATE ANSWER (RAG)
   Query + Relevant chunks → OpenAI GPT → AI-generated answer
```

### System Architecture

```
Frontend (React)
      ↓
API Server (FastAPI)
      ↓
RAG Engine (Python)
      ├─ FAISS (Vector search)
      ├─ OpenAI API (Embeddings & LLM)
      └─ Local storage (Index & metadata)
```

---

## 🔧 Development

### Running Tests

```bash
cd rag-system
python test_rag.py
```

### Virtual Environment

```bash
# Activate
source rag-system/backend/venv/bin/activate

# Deactivate
deactivate
```

### API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI with all endpoints.

---

## 🚀 Production Deployment

### Docker (Recommended)

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY rag-system/backend .

RUN pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 📊 Performance

| Metric | Performance |
|--------|-------------|
| Upload (1000 words) | ~2-5 seconds |
| Search | <100ms (with FAISS) |
| Query (RAG answer) | ~3-5 seconds |
| Index size | ~1MB per 1000 documents |

---

## 🛠️ Troubleshooting

### "OPENAI_API_KEY not found"
- Create `.env` file in `backend/` directory
- Add your OpenAI API key: `OPENAI_API_KEY=sk-...`

### "Module not found" errors
- Activate virtual environment: `source venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`

### CORS errors
- Backend has CORS enabled by default
- Ensure frontend URL matches allowed origins in `main.py`

### No documents indexed
- Upload at least one document before querying
- Check `/documents` endpoint to verify uploads

---

## 📝 Use Cases

✅ **Semantic Search** - Search documents by meaning, not keywords  
✅ **Q&A System** - Build a chatbot over your documentation  
✅ **Knowledge Base** - Create intelligent search over internal docs  
✅ **Test Generation** - Auto-generate tests from requirements  
✅ **Research** - Analyze multiple research papers  
✅ **Support** - Automated customer support answers  

---

## 🔐 Security

- API key stored in `.env` (never committed)
- Input validation on all endpoints
- CORS enabled for frontend integration
- HTTPS recommended for production

---

## 📦 Dependencies

### Backend
- fastapi - Web framework
- uvicorn - ASGI server
- openai - OpenAI API client
- faiss-cpu - Vector search
- pydantic - Data validation
- python-dotenv - Environment variables

### Frontend
- React - UI library
- Fetch API - HTTP requests

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) - GPT models & embeddings
- [FAISS](https://github.com/facebookresearch/faiss) - Vector similarity search
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - Frontend library

---

## 📞 Support

For issues, questions, or suggestions:
1. Check the [README in rag-system/](rag-system/README.md)
2. Review [API docs](http://localhost:8000/docs)
3. Open an issue on GitHub

---

## 🎉 Quick Links

- 📖 [Detailed RAG Documentation](rag-system/README.md)
- 🔗 [OpenAI API Keys](https://platform.openai.com/account/api-keys)
- 📚 [FastAPI Documentation](https://fastapi.tiangolo.com/)
- 🔍 [FAISS GitHub](https://github.com/facebookresearch/faiss)

---

**Made with ❤️ using Python, OpenAI, and React**

⭐ If this project helps you, please give it a star!
