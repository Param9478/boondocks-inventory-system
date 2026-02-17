const adminMiddleware = (req, res, next) => {
  try {
    // Check if user exists (added by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization error',
    });
  }
};

module.exports = adminMiddleware;
