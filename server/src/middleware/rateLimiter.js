const requestsMap = new Map();

/**
 * Basic in-memory rate limiter
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Max requests allowed per window per IP
 */
export function rateLimiter(windowMs = 60000, maxRequests = 5) {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    const record = requestsMap.get(ip);

    if (!record) {
      requestsMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    record.count += 1;
    if (record.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests from this IP. Please wait a moment before trying again.'
      });
    }

    next();
  };
}
