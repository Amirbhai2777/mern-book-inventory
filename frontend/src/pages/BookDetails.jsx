// import React, { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { getBook } from '../api/books';

// export default function BookDetails(){
//   const { id } = useParams();
//   const [book, setBook] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(()=>{
//     (async()=>{
//       try{ setError(''); const data = await getBook(id); setBook(data);}catch(e){ setError(e?.response?.data?.message || e.message) }
//     })();
//   },[id]);

//   if(error) return <div style={{color:'#b91c1c'}}>Error: {error}</div>
//   if(!book) return <div>Loading...</div>

//   return (
//     <div>
//       <h2 style={{marginTop:0}}>{book.title}</h2>
//       <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,maxWidth:700}}>
//         <Field label="Author" value={book.author} />
//         <Field label="Publisher" value={book.publisher || '-'} />
//         <Field label="Published" value={book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : '-'} />
//       </div>
//       {book.description && (
//         <div style={{marginTop:12}}>
//           <strong>Description</strong>
//           <p style={{marginTop:6}}>{book.description}</p>
//         </div>
//       )}
//       <div style={{display:'flex',gap:8,marginTop:16}}>
//         <Link to={`/books/${book._id}/edit`} style={btn}>Edit</Link>
//         <Link to="/" style={btn}>Back</Link>
//       </div>
//     </div>
//   )
// }

// function Field({label, value}){
//   return (
//     <div>
//       <div style={{fontSize:12,color:'#6b7280'}}>{label}</div>
//       <div>{value}</div>
//     </div>
//   )
// }

// const btn = { padding:'8px 12px', border:'1px solid #d1d5db', borderRadius:6, background:'#fff' };




import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBook } from '../api/books';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setError('');
        const data = await getBook(id);
        setBook(data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      }
    })();
  }, [id]);

  if (error) return <div style={{ color: '#b91c1c', marginTop: 20 }}>Error: {error}</div>;
  if (!book) return <div style={{ marginTop: 20 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: 20, border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginTop: 0, marginBottom: 16, color: '#1f2937' }}>{book.title}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <Field label="Author" value={book.author} />
        <Field label="Publisher" value={book.publisher || '-'} />
        <Field label="Published" value={book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : '-'} />
      </div>

      {book.description && (
        <div style={{ marginBottom: 20 }}>
          <strong style={{ display: 'block', marginBottom: 6, color: '#374151' }}>Description</strong>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#4b5563' }}>{book.description}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to={`/books/${book._id}/edit`} style={btnPrimary}>Edit</Link>
        <Link to="/" style={btnSecondary}>Back</Link>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ padding: 10, background: '#f9fafb', borderRadius: 6 }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 500, color: '#111827' }}>{value}</div>
    </div>
  );
}

// Buttons
const btnPrimary = {
  padding: '10px 16px',
  border: 'none',
  borderRadius: 6,
  background: '#2563eb',
  color: '#fff',
  fontWeight: 500,
  cursor: 'pointer',
  textDecoration: 'none'
};

const btnSecondary = {
  padding: '10px 16px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  background: '#fff',
  color: '#111827',
  fontWeight: 500,
  cursor: 'pointer',
  textDecoration: 'none'
};
