

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { deleteBook, listBooks } from '../api/books';

export default function BooksList() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page') || 1);
  const q = params.get('q') || '';

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await listBooks({ page, q, limit: 10, sort: '-createdAt' });
      setData(res);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page, q]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(data.total / data.limit)), [data]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Books</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Search by title/author/publisher"
            value={q}
            onChange={(e) => setParams(p => { p.set('q', e.target.value); p.set('page', '1'); return p; })}
            style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, minWidth: 260 }}
          />
          <Link to="/books/new" style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', borderRadius: 6 }}>Add Book</Link>
        </div>
      </div>

      {error && <div style={{ marginTop: 12, color: '#b91c1c' }}>Error: {error}</div>}
      {loading ? (
        <div style={{ padding: 24 }}>Loading...</div>
      ) : (
        <div
          style={{
            overflowX: 'auto',
            overflowY: 'auto',
            marginTop: 12,
            maxHeight: '73vh',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            scrollbarWidth: 'none', 
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Title</th>
                <th style={th}>Author</th>
                <th style={th}>Publisher</th>
                <th style={th}>Published</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map(b => (
                <tr key={b._id}>
                  <td style={td}><Link to={`/books/${b._id}`}>{b.title}</Link></td>
                  <td style={td}>{b.author}</td>
                  <td style={td}>{b.publisher || '-'}</td>
                  <td style={td}>{b.publishedDate ? new Date(b.publishedDate).toLocaleDateString() : '-'}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/books/${b._id}/edit`} style={btn}>Edit</Link>
                      <button
                        onClick={async () => { if (confirm('Delete?')) { await deleteBook(b._id); load(); } }}
                        style={btnDanger}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    
    </div>
  );
}

const th = { textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', position: 'sticky', top: 0 };
const td = { padding: '10px 12px', borderBottom: '1px solid #e5e7eb' };
const btn = { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff' };
const btnDanger = { ...btn, borderColor: '#fecaca', background: '#fee2e2', color: '#b91c1c' };
