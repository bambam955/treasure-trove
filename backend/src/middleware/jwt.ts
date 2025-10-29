import { expressjwt } from 'express-jwt';

// This middleware should be used in ALL API endpoints that access protected resources!!
// We want to make sure only authorized users can do things that require authorization.
export const requireAuth = expressjwt({
  secret: () => process.env.JWT_SECRET,
  algorithms: ['HS256'],
});
