/**
 * Simple password authentication middleware
 */

const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'tikshop2026';

function checkAuth(req) {
  const authHeader = req.headers.authorization;
  const password = req.headers['x-access-password'];
  
  // Check Authorization header (Bearer token)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === ACCESS_PASSWORD) {
      return true;
    }
  }
  
  // Check custom header
  if (password === ACCESS_PASSWORD) {
    return true;
  }
  
  return false;
}

function requireAuth(handler) {
  return async (req, res) => {
    if (!checkAuth(req)) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid password required. Contact Logan for access.'
      });
    }
    
    return handler(req, res);
  };
}

module.exports = { checkAuth, requireAuth, ACCESS_PASSWORD };
