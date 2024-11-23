// app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mysql = require('mysql2')
const router = require('./routes/taskRouter');
const feedrouter = require('./routes/feedRouter');
const profileRoutes = require('./routes/routes');
const videoRouter = require('./routes/videoRouter'); // Novo import
const app = express();

app.set('port', process.env.PORT || 3005);
app.use(cors());
app.use(express.json());

app.use('/api', router);
app.use('/api/comments', feedrouter);
app.use('/api', feedrouter);
app.use('/api', profileRoutes);
app.use('/api', videoRouter); // Nova rota de vídeos

module.exports = app;
