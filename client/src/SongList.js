// SongList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SongForm from './SongForm';
import styles from './SongList.module.css';
import axios from 'axios';

function SongList() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const getSongs = async () => {
      const response = await fetch('http://localhost:9000/songs');
      const songs = await response.json();
      setSongs(songs);
    };

    getSongs();
  }, []);

  const deleteSong = async (id) => {
    try {
      await axios.delete(`/songs/${id}`);
      setSongs(songs.filter(song => song._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.list}>
      <h1>Song List</h1>
      <SongForm />
      {songs.map((song) => (
        <div key={song.id} className={styles.song}>
          <Link to={`/song/${song._id}`} className={styles.link}>{song.title}</Link>
          <button onClick={() => deleteSong(song._id)} className={styles.button}>X</button>
        </div>
      ))}
    </div>
  );
}

export default SongList;