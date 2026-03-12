var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors');
var dotenv = require('dotenv');

var { connectDB } = require('./src/config/db');
var { notFound, errorHandler } = require('./src/middleware/errorHandler');

var authRouter = require('./src/routes/auth');
var productsRouter = require('./src/routes/products');
var ordersRouter = require('./src/routes/orders');
var adminRouter = require('./src/routes/admin');

dotenv.config();
connectDB().catch(function (err) {
  // eslint-disable-next-line no-console
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

app.get('/api/health', function (req, res) {
  res.json({ ok: true, service: 'shopez-backend' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
