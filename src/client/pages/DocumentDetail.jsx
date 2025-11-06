import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { documentApi } from '@/client/services/documentApi.js';

const DocumentDetail = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await documentApi.getDocument(id);
        setDoc(data);
      } catch (e) {
        setError('Không thể tải tài liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="dashboard-page" style={{ padding: '20px' }}>
      <style>{`
        .dashboard-page { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .dashboard-title { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700; font-size: 2.5rem; text-align: center; margin-bottom: 2rem; }
        .ticket-center { background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%); border: 1px solid #2a2a2a; border-radius: 16px; padding: 24px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
        .doc-meta { color:#ccc; }
      `}</style>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="dashboard-title" style={{ marginBottom: 0, fontSize: '2rem' }}>CHI TIẾT TÀI LIỆU</h1>
        <Link to="/documents" className="btn btn-light">Quay lại</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center text-muted py-4">Đang tải...</div>
      ) : !doc ? (
        <div className="text-center text-muted py-4">Không tìm thấy tài liệu</div>
      ) : (
        <div className="ticket-center">
          <div className="mb-3">
            <h3 className="m-0 text-white">{doc.title}</h3>
            {/* <div className="small text-muted">{doc.type}</div> */}
          </div>
          <div className="mb-3 text-muted">
            {doc.description || '—'}
          </div>
          <a className="btn btn-primary" href={doc.link} target="_blank" rel="noreferrer">Mở link</a>
        </div>
      )}
    </div>
  );
};

export default DocumentDetail;


