import { body, param, query } from 'express-validator';

export const createBookValidation = [
  body('title').isString().trim().notEmpty().withMessage('title is required'),
  body('author').isString().trim().notEmpty().withMessage('author is required'),
  body('publishedDate').optional().isISO8601().toDate(),
  body('publisher').optional().isString().trim(),
  body('description').optional().isString().trim()
];

export const updateBookValidation = [
  param('id').isMongoId(),
  body('title').optional().isString().trim().notEmpty(),
  body('author').optional().isString().trim().notEmpty(),
  body('publishedDate').optional().isISO8601().toDate(),
  body('publisher').optional().isString().trim(),
  body('description').optional().isString().trim()
];

export const listQueryValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('q').optional().isString().trim(),
  query('sort').optional().isString().trim()
];
