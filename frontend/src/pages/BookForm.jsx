
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  TextField,
  Button,
  Grid,
  Typography
} from '@mui/material';

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

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Load book data for edit
  useEffect(() => {
    if (edit && id) {
      (async () => {
        const res = await fetch(
          `https://mern-book-inventory-2.onrender.com/api/books/${id}`
        );
        const data = await res.json();

        setValue('title', data.title || '');
        setValue('author', data.author || '');
        setValue(
          'publishedDate',
          data.publishedDate
            ? new Date(data.publishedDate).toISOString().slice(0, 10)
            : ''
        );
        setValue('publisher', data.publisher || '');
        setValue('description', data.description || '');
      })();
    }
  }, [edit, id, setValue]);

  const onSubmit = async (values) => {
    const payload = { ...values };

    if (!payload.publishedDate) {
      delete payload.publishedDate;
    } else {
      payload.publishedDate = new Date(payload.publishedDate).toISOString();
    }

    const API_BASE = 'https://mern-book-inventory-2.onrender.com/api';

    const url = edit
      ? `${API_BASE}/books/${id}`
      : `${API_BASE}/books`;

    const method = edit ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    navigate('/');
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {edit ? 'Edit Book' : 'Add Book'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Row 1 */}
          <Grid size={6}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
               placeholder='Title'
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
          </Grid>

          <Grid size={6}>
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                 placeholder='Auther'
                  fullWidth
                  error={!!errors.author}
                  helperText={errors.author?.message}
                />
              )}
            />
          </Grid>

          {/* Row 2 */}
           <Grid size={6}>
            <Controller
              name="publisher"
              control={control}
              render={({ field }) => (
                <TextField {...field} placeholder='Publisher' fullWidth />
              )}
            />
          </Grid>

          <Grid size={6}>
            <Controller
              name="publishedDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Published Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Row 3 */}
          <Grid size={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder='Description'
                  multiline
                  rows={4}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
