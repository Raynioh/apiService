import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv'
import controller from './controllers/controller';
import cors from 'cors';

dotenv.config()

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://193.168.53.212:3050'
}));

const baseUrl = process.env.BASE_URL || "193.198.53.212";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3050;

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

app.listen(port, baseUrl, () => {
  console.log(`Listening on ${baseUrl}:${port}`);
});
