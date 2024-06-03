const express = require('express');
const cors = require('cors');
const db = require('./db')
const app = express();
const port = 3000;
const crypto = require('crypto');

app.use(cors());

app.use(express.json());

function randomToken(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.get('/', (req, res) => {
  });

app.post('/users', (req, res) => {
  const { username, password } = req.body;
  const success = db.signup(username, password);
  if (success) {
    res.status(201).send(`User ${username} created successfully`);
  } else {  
    res.status(409).send('User already exists');
  }
});

app.post('/highscores', (req, res) => {
  const { username, score } = req.body;
  
  if (!username || !score) {
    return res.status(400).json({ message: 'Username and score are required' });
  }

  db.highscores.push({ username, score });
  res.status(201).json({ message: 'Highscore saved successfully' });
});

app.get('/highscores', (req, res) => {
  if (db.highscores.length === 0) {
    return res.status(204).json({ message: 'No highscores found' });
  }
  res.status(200).json(db.highscores);
});

app.post('/sessions', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  const loginSuccessful = db.login(username, password);
  
  if (loginSuccessful) {
    const token = randomToken(16);
    db.tokens.push({ username: username, token: token });
    res.json({ token: token });
    res.status(200).send({ message: `User ${username} logged in successfully`})
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

app.put('/users/:id', (req, res) => {
    const updatedUser = req.body
    const user = users.find(user => user.id === req.params.id)
    Object.assign(user, updatedUser)
    res.send(`User ${user.name} updated`)
})

app.delete('/sessions', (req, res) => {
  const { token } = req.body;
  
  const index = db.tokens.findIndex(t => t.token === token);
  
  if (index !== -1) {
    db.tokens.splice(index, 1);
    res.status(200).json({ message: 'Logged out successfully' });
  } else {
    res.status(400).json({ message: 'Invalid token' });
  }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });