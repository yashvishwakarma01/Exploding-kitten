const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const { startGame, drawCard, saveGame, fetchLeaderboard } = require('./controllers/gameController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/exploding-kittens');

app.post('/start-game', startGame);
app.post('/draw-card', drawCard);
app.post('/save-game', saveGame);
app.get('/leaderboard', fetchLeaderboard);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});