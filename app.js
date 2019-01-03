import express from 'express';
import meetups from './src/routes/meetups';
import questions from './src/routes/questions';

const app = express();

// JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/v1', (req, res) => {
  res.send({
    status: 200,
    message: 'Welcome to Questioner!',
  });
});

// Routes middleware
app.use('/api/v1/meetups', meetups);
app.use('/api/v1/questions', questions);


const port = process.env.port || 7000;

app.listen(port);

module.exports = app;
