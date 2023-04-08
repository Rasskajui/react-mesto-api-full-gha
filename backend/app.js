const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes');

const errorsHandler = require('./middlewares/errors');

const cors = require('./middlewares/cors');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(requestLogger);
app.use(cors);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
