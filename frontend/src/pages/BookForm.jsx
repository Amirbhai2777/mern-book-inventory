import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBook, getBook, updateBook } from '../api/books';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publishedDate: z.string().optional(),
  publisher: z.string().optional(),
  description: z.string().optional(),
});

export default function BookForm({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (edit && id) {
      (async () => {
        const data = await getBook(id);
        Object.entries({
          title: data.title || '',
          author: data.author || '',
          publishedDate: data.publishedDate ? new Date(data.publishedDate).toISOString().slice(0,10) : '',
          publisher: data.publisher || '',
          description: data.description || ''
        }).forEach(([k, v]) => setValue(k, v));
      })();
    }
  }, [edit, id, setValue]);

  const onSubmit = async (values) => {
    const payload = { ...values };
    if (payload.publishedDate === '') delete payload.publishedDate; else if (payload.publishedDate) payload.publishedDate = new Date(payload.publishedDate).toISOString();
    try {
      if (edit && id) await updateBook(id, payload); else await createBook(payload);
      navigate('/');
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div>
      <h2 style={{marginTop:0}}>{edit ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,maxWidth:800}}>
        <Field label="Title" error={errors.title?.message}><input {...register('title')} /></Field>
        <Field label="Author" error={errors.author?.message}><input {...register('author')} /></Field>
        <Field label="Publisher"><input {...register('publisher')} /></Field>
        <Field label="Published Date"><input type="date" {...register('publishedDate')} /></Field>
        <div style={{gridColumn:'1 / -1'}}>
          <div style={{fontSize:12,color:'#6b7280'}}>Description</div>
          <textarea rows={4} {...register('description')} style={{width:'100%'}} />
        </div>
        <div style={{gridColumn:'1 / -1',display:'flex',gap:8}}>
          <button type="submit" disabled={isSubmitting} style={btnPrimary}>{isSubmitting ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={()=>navigate('/')} style={btn}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label style={{display:'grid'}}>
      <div style={{fontSize:12,color:'#6b7280'}}>{label}</div>
      <div style={{display:'grid'}}>
        {React.cloneElement(children, { style: { padding:'8px 10px', border:'1px solid #d1d5db', borderRadius:6 } })}
        {error && <span style={{color:'#b91c1c', fontSize:12, marginTop:4}}>{error}</span>}
      </div>
    </label>
  );
}

const btnPrimary = { padding:'8px 12px', border:'1px solid #2563eb', borderRadius:6, background:'#2563eb', color:'#fff' };
const btn = { padding:'8px 12px', border:'1px solid #d1d5db', borderRadius:6, background:'#fff' };
