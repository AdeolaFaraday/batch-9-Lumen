/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

import { getDefaultCategory } from '../services/home/service';
import isEmpty from '../utils/validations/isEmpty';

const { Schema } = mongoose;

const BlogsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: true
    },
    title: {
      type: String,
      required: true,
      default: 'My Blog'
    },
    content: {
      type: String,
      required: true,
      default: '## My Blog is about'
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    published: {
      type: Boolean,
      default: false
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Categories'
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true
  }
);

BlogsSchema.index(
  {
    title: 'text',
    content: 'text'
  },
  {
    name: 'SearchBlogIndex',
    weights: {
      title: 10,
      content: 1
    }
  }
);

BlogsSchema.pre('save', async function save (next) {
  if(isEmpty(this.category)) {
   const defaultCategory =  await getDefaultCategory();
   this.category = defaultCategory._id
  }
  next();
})

const Blogs = mongoose.model('Blogs', BlogsSchema);
export default Blogs;
