const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
// Set security HTTP Headers
app.use(helmet());

// Log dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// rate limit request
const limiter = rateLimit({
  max: 100,
  windowMs: 1 * 60 * 60 * 1000,
  message: 'Too many request at the same time',
});

// body parser
app.use(express.json({ limit: '10kb' }));

// Data sanitize
app.use(mongoSanitize());

// xss
app.use(xss());

// http polution params
app.use(
  hpp({
    whitelist: ['price', 'duration'],
  })
);

// Serving static file
app.use(express.static(`${__dirname}/public`));

// throtte:100
app.use('/api', limiter);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
