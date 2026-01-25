import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import BooksList from './pages/BooksList.jsx'
import BookDetails from './pages/BookDetails.jsx'
import BookForm from './pages/BookForm.jsx'

function App() {
  return (
    <BrowserRouter>
      <header style={{
        padding: '1px 16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between', // Title left, links right
        alignItems: 'center'
      }}>
        <h3 style={{ fontWeight: 700 }}>Book Inventory</h3>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/books/new">Add Book</Link>
        </nav>
      </header>

      <main style={{ padding: 16, maxWidth: 1000, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<BooksList />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/books/:id/edit" element={<BookForm edit />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App