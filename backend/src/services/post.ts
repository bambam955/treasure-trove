import mongoose from 'mongoose';
import { Post } from '../db/models/post.ts';
import { User } from '../db/models/user.ts';

export interface PostData {
  title: string;
  author?: string;
  contents?: string;
  tags?: string[];
}

interface CreatePostData {
  title: string;
  contents?: string;
  tags?: string[];
}

interface ListOptions {
  sortBy?: string;
  sortOrder?: string;
}

export async function createPost(
  userId: string,
  { title, contents, tags }: CreatePostData,
) {
  const post = new Post({
    title,
    author: new mongoose.Types.ObjectId(userId),
    contents,
    tags,
  });
  return await post.save();
}

async function listPosts(
  query: object = {},
  { sortBy = 'createdAt', sortOrder = 'descending' }: ListOptions = {},
) {
  return await Post.find(query).sort({
    [sortBy]: sortOrder === 'descending' ? -1 : 1,
  });
}

export async function listAllPosts(options?: ListOptions) {
  return await listPosts({}, options);
}

export async function listPostsByAuthor(
  authorUsername: string,
  options?: ListOptions,
) {
  const user = await User.findOne({ username: authorUsername });
  if (!user) return [];
  return await listPosts({ author: user._id }, options);
}

export async function listPostsByTag(tags: string[], options?: ListOptions) {
  return await listPosts({ tags: { $in: tags } }, options);
}

export async function getPostById(postID: string) {
  return await Post.findById(postID);
}

export async function updatePost(
  userId: string,
  postID: string,
  { title, contents, tags }: Partial<CreatePostData>,
) {
  return await Post.findOneAndUpdate(
    { _id: postID, author: new mongoose.Types.ObjectId(userId) },
    { $set: { title, contents, tags } },
    { new: true },
  );
}

export async function deletePost(userId: string, postId: string) {
  return await Post.deleteOne({
    _id: postId,
    author: new mongoose.Types.ObjectId(userId),
  });
}
