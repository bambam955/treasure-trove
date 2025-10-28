import mongoose from 'mongoose';
import { describe, expect, test, beforeEach } from '@jest/globals';

import {
  createPost,
  deletePost,
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  PostData,
  updatePost,
} from '../services/post.ts';
import { Post } from '../db/models/post.ts';
import { User } from '../db/models/user.ts';

describe('creating posts', () => {
  test('With all parameters should succeed', async () => {
    const postData = {
      title: 'Hello Mongoose!',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    };
    const createdPost = await createPost(testUser._id.toString(), postData);
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId);
    const foundPost = await Post.findById(createdPost._id);
    expect(foundPost).toEqual(
      expect.objectContaining({ ...postData, author: testUser._id }),
    );
    expect(foundPost!.createdAt).toBeInstanceOf(Date);
    expect(foundPost!.updatedAt).toBeInstanceOf(Date);
  });

  test('with minimal parameters should succeed', async () => {
    const postData = {
      title: 'Only a title',
    };
    const createdPost = await createPost(testUser._id.toString(), postData);
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
});

const samplePosts: Omit<PostData, 'author'>[] = [
  { title: 'Learning Redux', tags: ['redux'] },
  { title: 'Learn React Hooks', tags: ['react'] },
  {
    title: 'Full-Stack React Projects',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to TypeScript' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let createdSamplePosts: any[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let testUser: any;

beforeEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
  testUser = new User({ username: 'Daniel Bugl', password: 'hashed' });
  await testUser.save();
  createdSamplePosts = [];
  for (const post of samplePosts) {
    const postData = { ...post, author: testUser._id };
    const createdPost = new Post(postData);
    createdSamplePosts.push(await createdPost.save());
  }
});

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts();
    expect(posts.length).toEqual(createdSamplePosts.length);
  });
  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts();
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    );
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    );
  });
  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    });
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    );
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    );
  });
  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('Daniel Bugl');
    expect(posts.length).toBe(4);
  });
  test('should be able to filter by tag', async () => {
    const posts = await listPostsByTag(['nodejs']);
    expect(posts.length).toBe(1);
  });
});

describe('operations on specific posts', () => {
  test('should be able to get a post by its ID', async () => {
    for (const samplePost of createdSamplePosts) {
      const post = await getPostById(samplePost._id);
      expect(post!.title).toEqual(samplePost.title);
    }
  });
  test('should be able to update a post by its ID', async () => {
    for (const samplePost of createdSamplePosts) {
      await updatePost(samplePost.author, samplePost._id, {
        contents: `new content ${samplePost.contents ?? 'nothing'}`,
        tags: [...samplePost.tags, 'test tag'],
      });
      const newPost = await getPostById(samplePost._id);
      expect(newPost!.contents).toEqual(
        `new content ${samplePost.contents ?? 'nothing'}`,
      );
      expect(newPost!.tags).toEqual([...samplePost.tags, 'test tag']);
    }
  });
  test('should be able to delete a post by its ID', async () => {
    const firstSamplePost = createdSamplePosts[0];
    await deletePost(firstSamplePost.author, firstSamplePost._id);
    const posts = await listAllPosts();
    expect(posts.length).toBe(3);
  });
});
