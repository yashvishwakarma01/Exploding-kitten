const User = require('../models/User');

const startGame = async (req, res) => {
  try {
    const { username } = req.body;
    let user = await User.findOne({ username });

    if (!user) {
      user = new User({ username });
      await user.save();
    }

    // Initialize game state
    user.gameState = {
      deck: ['Cat', 'Shuffle', 'Cat', 'Defuse', 'Exploding Kitten','Cat','Shuffle','Shuffle','Difuse'].sort(() => Math.random() - 0.5),
      drawnCards: [],
      defuseCards: 1,
    };

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const drawCard = async (req, res) => {
  try {
    const { deck, username } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { gameState } = user;
    console.log(gameState)

    if (gameState.deck.length === 0) {
      console.log("hello")
      return res.json({ success: true, deck: gameState.deck, gameWon: true });
    }
     console.log("Gamestack:"+gameState.deck)
    const drawnCard = gameState.deck.pop();
     console.log("DrawanCard:",drawnCard)
    gameState.drawnCards.push(drawnCard);
    console.log(gameState.drawnCards)
    if (drawnCard === 'Exploding Kitten' && gameState.defuseCards === 0) {
      console.log("if")
      // Game over if Exploding Kitten drawn without a defuse card
      user.points += 1; // Increment points for winning
      user.gameState = null; // Reset game state
      await user.save();
      return res.json({ success: true, deck: gameState.deck, gameWon: true });
    } else if (drawnCard === 'Defuse' && gameState.defuseCards > 0) {
      // Use a defuse card
      console.log('else')
      gameState.defuseCards -= 1;
    }

    await user.save();

    res.json({ success: true, deck: gameState.deck, gameWon: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const saveGame = async (req, res) => {
  try {
    const { username, deck } = req.body;

    let user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.gameState.deck = deck;

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const fetchLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({}, 'username points');
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = { startGame, drawCard, saveGame, fetchLeaderboard };
