import express from 'express';
import { validationResult } from 'express-validator';
import Book from '../models/Book.js';
import { createBookValidation, updateBookValidation, listQueryValidation } from '../validators/bookValidators.js';

const router = express.Router();

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

// Create
router.post('/', createBookValidation, async (req, res, next) => {
  const errRes = handleValidation(req, res);
  if (errRes) return; // already sent
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (e) {
    next(e);
  }
});

// List with search, sort, pagination
router.get('/', listQueryValidation, async (req, res, next) => {
  const errRes = handleValidation(req, res);
  if (errRes) return;
  try {
    const { page = 1, limit = 10, q = '', sort = '-createdAt' } = req.query;
    const filter = q
      ? { $or: [
          { title: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } },
          { publisher: { $regex: q, $options: 'i' } }
        ] }
      : {};

    const [items, total] = await Promise.all([
      Book.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      Book.countDocuments(filter)
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    next(e);
  }
});

// Read one
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (e) {
    next(e);
  }
});

// Update
router.put('/:id', updateBookValidation, async (req, res, next) => {
  const errRes = handleValidation(req, res);
  if (errRes) return;
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (e) {
    next(e);
  }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
});

export default router;
