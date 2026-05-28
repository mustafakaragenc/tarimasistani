// Hata ayıklama middleware
const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  // Log hata konsola
  console.error(err);

  // Mongoose ID yanlış format hatası
  if (err.name === 'CastError') {
    const message = 'Kaynak bulunamadı';
    error.message = message;
    error.statusCode = 404;
  }

  // Mongoose çoğul anahtar hatası
  if (err.code === 11000) {
    const message = `Çoğaltılamayan alan: ${Object.keys(err.keyValue)}`;
    error.message = message;
    error.statusCode = 400;
  }

  // JWT hatası
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token geçersiz';
    error.message = message;
    error.statusCode = 401;
  }

  // JWT Süresi Doldu
  if (err.name === 'TokenExpiredError') {
    const message = 'Token süresi dolmuş';
    error.message = message;
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Sunucu Hatası',
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
};

module.exports = errorHandler;
