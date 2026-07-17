import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import usuarioRouter from './src/routes/usuario.js';
import objetoRouter from './src/routes/objeto.js';
import reclamoRouter from './src/routes/reclamo.js';
import categoriaRouter from './src/routes/categoria.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.json({ mensaje: 'API Objetos Perdidos - Campus', code: 200 });
});

app.use('/auth', usuarioRouter);
app.use('/objeto', objetoRouter);
app.use('/reclamo', reclamoRouter);
app.use('/categoria', categoriaRouter);

export default app;