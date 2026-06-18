import React, { useState, useEffect } from 'react';
import './RAGSearch.css';

const RAGSearch = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  const API_BASE_URL = 'http://localhost:8000';

  // Fetch documents list
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`);
      const data = await response.json();
      setDocuments(data.documents);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setAnswer('');
    setSources([]);

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      setAnswer(data.answer);
      setSources(data.sources);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const data = await response.json();
      setError(`✓ Document "${file.name}" uploaded successfully! (${data.chunks_created} chunks created)`);
      fetchDocuments();
      e.target.value = '';
    } catch (err) {
      setError(`✗ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${filename}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      fetchDocuments();
      setError(`✓ Document "${filename}" deleted successfully`);
    } catch (err) {
      setError(`✗ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rag-container">
      <div className="rag-header">
        <h1>🔍 RAG Search Engine</h1>
        <p>Retrieval-Augmented Generation powered by OpenAI and FAISS</p>
      </div>

      <div className="rag-tabs">
        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents ({documents.length})
        </button>
      </div>

      {activeTab === 'search' && (
        <div className="rag-search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything about your documents..."
                className="search-input"
                disabled={loading}
              />
              <button type="submit" className="search-btn" disabled={loading || !query.trim()}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className={`error-message ${error.includes('✓') ? 'success' : 'error'}`}>
              {error}
            </div>
          )}

          {answer && (
            <div className="results-container">
              <div className="answer-section">
                <h3>Answer</h3>
                <p className="answer-text">{answer}</p>
              </div>

              {sources.length > 0 && (
                <div className="sources-section">
                  <h3>Sources</h3>
                  <ul className="sources-list">
                    {sources.map((source, idx) => (
                      <li key={idx}>{source}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="rag-documents-section">
          <div className="upload-section">
            <label className="upload-label">
              <input
                type="file"
                accept=".txt,.md,.pdf"
                onChange={handleFileUpload}
                disabled={loading}
                className="file-input"
              />
              <span className="upload-text">
                {loading ? 'Uploading...' : '+ Upload Document'}
              </span>
            </label>
          </div>

          {documents.length === 0 ? (
            <p className="empty-message">No documents uploaded yet. Upload a file to get started!</p>
          ) : (
            <div className="documents-list">
              <h3>Indexed Documents ({documents.length})</h3>
              {documents.map((doc, idx) => (
                <div key={idx} className="document-item">
                  <span className="doc-name">{doc}</span>
                  <button
                    onClick={() => handleDeleteDocument(doc)}
                    className="delete-btn"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RAGSearch;
