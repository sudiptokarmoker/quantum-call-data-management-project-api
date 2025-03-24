import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';

import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://admin.renesabazar.com',
      'https://www.admin.renesabazar.com',
      'http://localhost:3001',
      'https://renesabazar.com',
      'https://www.renesabazar.com',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Decode URL
app.use((req, res, next) => {
  req.url = decodeURIComponent(req.url);
  next();
});


app.get('/test', (req, res) => {
  res.status(200).send('Test route is working');
});

app.use('/api/v1', routes);
app.use('/uploads', express.static('uploads'));
// app.use('/upload/user', express.static('uploads/user'));

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
