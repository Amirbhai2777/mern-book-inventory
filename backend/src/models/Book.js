import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    publishedDate: { type: Date },
    publisher: { type: String, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
