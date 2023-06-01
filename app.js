require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const errorCelebrate = require('celebrate').errors;
const helmet = require('helmet');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { PORT, MONGODB } = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');

const app = express();

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.use(cors);
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);
app.use(errorCelebrate());
app.use(errorHandler);

app.listen(PORT);
