
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Stack
} from '@mui/material';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://mern-book-inventory-2.onrender.com/api/books/${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id]);

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        Error: {error}
      </Typography>
    );
  }

  if (!book) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" mt={3}>
      <Card elevation={3}>
        <CardContent>
          {/* Title */}


          {/* Info grid */}
          <Grid container spacing={2} mb={2}>
            <Grid size={6}>
              <Field label="Title" value={book.title} />
            </Grid>

            <Grid size={6}>
              <Field label="Author" value={book.author} />
            </Grid>

            <Grid size={6}>
              <Field
                label="Publisher"
                value={book.publisher || '-'}
              />
            </Grid>

            <Grid size={6}>
              <Field
                label="Published"
                value={
                  book.publishedDate
                    ? new Date(
                      book.publishedDate
                    ).toLocaleDateString()
                    : '-'
                }
              />
            </Grid>
          </Grid>

          {/* Description */}


          {book.description && (
            <Grid size xs={12}>
              <Field
                label="Description"
                value={book.description}
              />
            </Grid>
          )}


          {/* Actions */}
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              component={Link}
              to={`/books/${book._id}/edit`}
              variant="contained"
            >
              Edit
            </Button>

            <Button
              component={Link}
              to="/"
              variant="outlined"
            >
              Back
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function Field({ label, value }) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: '#f9fafb',
        borderRadius: 1
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
      >
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  );
}
