import './config/load-dotenv.js';

import express from 'express';
import session from 'express-session';

import apiRouter from './routers/api/apiRouter.js';
import webRouter from './routers/web/webRouter.js';
import logger from './middlewares/logger.js';

const app = express();
const PORT = 3000;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static('public'));
app.use(express.json());
app.use(logger);

app.use('/api', apiRouter);
app.use('/web', webRouter);

app.use((req, res) => res.redirect('/web/auth/signin'));

app.listen(PORT, () => {
    console.log("ESCUTANDO NA PORTA "+PORT);
});