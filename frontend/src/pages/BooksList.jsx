
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';

export default function BooksList() {
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page') || 1);
  const q = params.get('q') || '';

  // 🔹 LOAD BOOKS
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://mern-book-inventory-2.onrender.com/api/books?page=${page}&q=${q}&limit=10&sort=-createdAt`
      );
      const result = await res.json();
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 DELETE BOOK
  const deleteBook = async (id) => {
    await fetch(
      `https://mern-book-inventory-2.onrender.com/api/books/${id}`,
      { method: 'DELETE' }
    );
  };

  useEffect(() => {
    load();
  }, [page, q]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.total / data.limit)),
    [data]
  );

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        mb={2}
      >
        <Typography variant="h5">Books</Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            placeholder="Search by title / author / publisher"
            value={q}
            onChange={(e) =>
              setParams((p) => {
                p.set('q', e.target.value);
                p.set('page', '1');
                return p;
              })
            }
          />

          <Button
            component={Link}
            to="/books/new"
            variant="contained"
          >
            Add Book
          </Button>
        </Stack>
      </Stack>

      {/* Error */}
      {error && (
        <Typography color="error" mb={2}>
          Error: {error}
        </Typography>
      )}

      {/* Loading */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: '73vh',
            overflowY: 'auto',

            /* 🔹 Hide scrollbar */
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: '#e5e7eb' // light gray
                }}
              >
                <TableCell >Title</TableCell>
                <TableCell >Author</TableCell>
                <TableCell >Publisher</TableCell>
                <TableCell >Published</TableCell>
                <TableCell >Actions</TableCell>
              </TableRow>

            </TableHead>

            <TableBody>
              {data.items.map((b, index) => (
                <TableRow
                  key={b._id}
                  hover
                  sx={{
                    bgcolor: index % 2 === 0 ? '#f9fafb' : '#f3f4f6',
                    '&:hover': {
                      bgcolor: '#e0f2fe'
                    }
                  }}
                >
                  <TableCell>
                    <Link to={`/books/${b._id}`}>
                      {b.title}
                    </Link>
                  </TableCell>

                  <TableCell>{b.author}</TableCell>

                  <TableCell>
                    {b.publisher || '-'}
                  </TableCell>

                  <TableCell>
                    {b.publishedDate
                      ? new Date(
                        b.publishedDate
                      ).toLocaleDateString()
                      : '-'}
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        component={Link}
                        to={`/books/${b._id}/edit`}
                        variant="outlined"
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={async () => {
                          if (window.confirm('Delete?')) {
                            await deleteBook(b._id);
                            load();
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {data.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No books found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

