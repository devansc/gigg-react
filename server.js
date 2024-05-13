const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 9000;

app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://devansc:KHrNTwsXeAUfxGPe@cluster0.ojffldh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error', err));

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

// Define a schema for the song
const songSchema = new mongoose.Schema({
  title: String,
  sections: [{ name: String, value: String }]
});

// Create a model from the schema
const Song = mongoose.model('Song', songSchema);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to get songs
app.get('/songs', async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

app.get('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      res.status(404).send('Song not found');
    } else {
      res.json(song);
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Endpoint to save a song
app.post('/songs', async (req, res) => {
  const song = new Song(req.body);
  await song.save();
  res.status(201).json(song);
});

app.put('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!song) {
      res.status(404).send('Song not found');
    } else {
      res.json(song);
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.delete('/songs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Assuming you're using a database, replace this with your actual delete logic
    await db.collection('songs').deleteOne({ _id: id });

    res.status(200).send({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete song' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

db.once('open', function() {
  app.listen(9000, () => {
    console.log('Listening on port 9000');
  });
});