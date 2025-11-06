import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { documentApi } from '@/client/services/documentApi.js';

const Documents = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const cats = await documentApi.listCategories();
        setCategories(cats);
        // mặc định chọn "Tất cả"
        setActiveCategoryId('');
        const docs = await documentApi.listDocuments();
        setDocuments(docs);
      } catch (e) {
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const onSelectCategory = async (id) => {
    try {
      setActiveCategoryId(id);
      setLoading(true);
      const docs = id === ''
        ? await documentApi.listDocuments()
        : await documentApi.listDocumentsByCategory(id);
      setDocuments(docs);
    } catch (e) {
      setError('Không thể tải tài liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page" style={{ padding: '20px' }}>
      <style>{`
        .dashboard-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .dashboard-title {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .info-card {
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }
        
        .info-card-title {
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        .info-card-value {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-icon {
          color: #FFD700;
          font-size: 1.2rem;
        }
        
        .cta-banner {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          margin: 2rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .cta-text {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .facebook-btn {
          background: linear-gradient(135deg, #1877f2 0%, #0d5bb8 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          color: #fff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .facebook-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(24, 119, 242, 0.3);
        }
        
        .ticket-center {
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .ticket-center-title {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 24px;
        }
        
        .search-filter-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        
        .search-input {
          flex: 1;
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
        }
        
        .search-input::placeholder {
          color: #888;
        }
        
        .filter-btn {
          background: #2a2a2a;
          border: 1px solid #444;
          border-radius: 8px;
          padding: 12px 16px;
          color: #fff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .filter-btn:hover {
          background: #333;
          border-color: #FFD700;
        }
        
        .table-header {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #333;
          margin-bottom: 24px;
        }
        
        .table-header-item {
          color: #888;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
        
        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 24px;
          opacity: 0.7;
        }
        
        .empty-state-title {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .empty-state-subtitle {
          color: #888;
          font-size: 0.9rem;
        }
        
        .ticket-item {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #333;
          align-items: center;
        }
        
        .ticket-item:last-child {
          border-bottom: none;
        }
        
        .ticket-code {
          color: #FFD700;
          font-weight: 600;
          font-family: monospace;
        }
        
        .ticket-date {
          color: #ccc;
          font-size: 0.9rem;
        }
        
        .ticket-type {
          color: #fff;
          font-size: 0.9rem;
        }
        
        .ticket-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-pending {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .status-processing {
          background: rgba(13, 110, 253, 0.2);
          color: #0d6efd;
          border: 1px solid rgba(13, 110, 253, 0.3);
        }
        
        .status-completed {
          background: rgba(25, 135, 84, 0.2);
          color: #198754;
          border: 1px solid rgba(25, 135, 84, 0.3);
        }
        
        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 2rem;
          }
          
          .cta-banner {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .search-filter-bar {
            flex-direction: column;
          }
          
          .table-header,
          .ticket-item {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
        /* Force table texts to white and reduce hover surprises */
        #documents-table .table thead th, #documents-table .table tbody td { color: #fff; }
        #documents-table .table tbody tr:hover { background-color: #2a2a2a !important; }
        #documents-table .table a { color: #0d6efd; }
      `}</style>
        <h1 className="dashboard-title">TÀI LIỆU</h1>

      <div className="cta-banner">
        <div className="text-white">Chọn danh mục để lọc và xem tài liệu theo dạng bảng.</div>
        <a className="btn btn-warning" href="#documents-table">Tới bảng tài liệu</a>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Bộ lọc theo Select (Responsive) */}
      <div className="ticket-center mb-3">
        <div className="search-filter-bar" style={{ marginBottom: 0 }}>
          <div className="w-100" style={{maxWidth: 400}}>
            <label className="form-label text-white">Danh mục</label>
            <select
              className="form-select search-input"
              value={activeCategoryId}
              onChange={(e) => onSelectCategory(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">Tất cả</option>
              {(categories || []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách tài liệu dạng Table */}
      <div className="ticket-center" id="documents-table">
          {loading ? (
            <div className="text-center text-muted py-4">Đang tải...</div>
          ) : (documents || []).length === 0 ? (
            <div className="text-center text-muted py-4">Không có tài liệu</div>
          ) : (
            <div className="table-responsive">
            <table className="table table-striped align-middle" style={{ color: '#fff' }}>
              <thead className="table-dark">
                  <tr>
                    <th style={{minWidth: 220}}>Tiêu đề</th>
                    <th>Danh mục</th>
                    <th>Loại</th>
                    <th>Link</th>
                    
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d) => {
                    const catName = (categories || []).find(c => c.id === d.categoryId)?.name || '—';
                    return (
                      <tr key={d.id}>
                        <td><strong>{d.title}</strong><div className="small text-muted">{d.description || '—'}</div></td>
                        <td>{catName}</td>
                        <td><span className="badge bg-secondary text-uppercase">{d.type}</span></td>
                        <td><a href={d.link} target="_blank" rel="noreferrer">Mở</a></td>
                        
                        <td className="d-flex gap-2">
                          <Link className="btn btn-primary btn-sm" to={`/documents/${d.id}`}>Chi tiết</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
};

export default Documents;


