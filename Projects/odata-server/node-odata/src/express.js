import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';

export default function () {
  const app = express();
  app.use(bodyParser({limit: 1024*1024*20}));
  app.use(bodyParser.raw({limit: 1024*1024*20}) );
  app.use(bodyParser.urlencoded({ limit: 1024*1024*20, extended: true }));
  app.use(bodyParser.json({limit: 1024*1024*20}));
  app.use(methodOverride());
  app.use(express.query());
  app.disable('x-powered-by');
  return app;
}
