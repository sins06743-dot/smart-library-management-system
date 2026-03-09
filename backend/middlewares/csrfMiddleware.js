// CSRF protection middleware
// For REST APIs using SameSite=strict cookies + CORS, we validate the Origin header
// to prevent cross-site request forgery attacks on state-changing endpoints.

/**
 * Validates the Origin header on state-changing requests (POST, PUT, DELETE, PATCH).
 * This is a standard CSRF mitigation technique for REST APIs.
 */
const csrfProtection = (req, res, next) => {
  // Only check state-changing methods
  const unsafeMethods = ["POST", "PUT", "DELETE", "PATCH"];
  if (!unsafeMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const allowedOrigin = process.env.FRONTEND_URL;

  // Allow requests with no origin (e.g., mobile apps, Postman during development)
  if (!origin && !referer) {
    return next();
  }

  // Validate origin or referer against allowed origin
  const requestOrigin = origin || (referer ? new URL(referer).origin : null);

  if (requestOrigin && requestOrigin !== allowedOrigin) {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed: invalid origin",
    });
  }

  next();
};

module.exports = csrfProtection;
