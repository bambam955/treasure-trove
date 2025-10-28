import type { Application, Request, Response } from 'express';
import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/post.ts';
import { requireAuth } from '../middleware/jwt.ts';

interface AuthenticatedRequest extends Request {
  auth: { sub: string };
}

export function postsRoutes(app: Application) {
  app.get('/api/v1/posts', async (req: Request, res: Response) => {
    const { sortBy, sortOrder, author, tag } = req.query;
    const options = {
      sortBy: sortBy as string,
      sortOrder: sortOrder as string,
    };
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'query by either author or tag, not both' });
      } else if (author) {
        return res.json(await listPostsByAuthor(author as string, options));
      } else if (tag) {
        return res.json(await listPostsByTag([tag as string], options));
      } else {
        return res.json(await listAllPosts(options));
      }
    } catch (err) {
      console.error('error listing posts', err);
      return res.status(500).end();
    }
  });

  app.get('/api/v1/posts/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const post = await getPostById(id);
      if (post === null) return res.status(404).end();
      return res.json(post);
    } catch (err) {
      console.error('error getting post', err);
      return res.status(500).end();
    }
  });

  app.post(
    '/api/v1/posts',
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const post = await createPost(
          (req as AuthenticatedRequest).auth.sub,
          req.body,
        );
        return res.json(post);
      } catch (err) {
        console.error('error creating post', err);
        return res.status(500).end();
      }
    },
  );

  app.patch(
    '/api/v1/posts/:id',
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const post = await updatePost(
          (req as AuthenticatedRequest).auth.sub,
          req.params.id,
          req.body,
        );
        return res.json(post);
      } catch (err) {
        console.error('error updating post', err);
        return res.status(500).end();
      }
    },
  );

  app.delete(
    '/api/v1/posts/:id',
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { deletedCount } = await deletePost(
          (req as AuthenticatedRequest).auth.sub,
          req.params.id,
        );
        if (deletedCount === 0) return res.sendStatus(404);
        return res.status(204).end();
      } catch (err) {
        console.error('error deleting post', err);
        return res.status(500).end();
      }
    },
  );
}
