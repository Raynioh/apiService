import express from 'express';
import http from 'http';
import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv'
import controller from './controllers/controller';
import cors from 'cors';

dotenv.config()

const app = express();
app.use(express.json());

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000;
const baseURL = externalUrl || `https://localhost:${port}`;

// app.use(cors({
//   origin: 'http://localhost:3050'
// }));

const checkJwt = auth({
  audience: process.env.API_IDENTIFIER,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
});
app.use(checkJwt);

app.use('/', controller);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  next(err);
});

if (externalUrl) {
  const hostname = '0.0.0.0';
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
    outside on ${externalUrl}`);
  });
} else {
  http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${baseURL}`);
  });
}
