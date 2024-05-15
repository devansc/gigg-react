// SongList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SongForm from './SongForm';
import styles from './SongList.module.css';
import axios from 'axios';

function SongList() {
  const [songs, setSongs] = useState([]);

  const baseUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:9000";
  console.log("Base URL is ", baseUrl);

  useEffect(() => {
    const getSongs = async () => {
      const response = await fetch(`${baseUrl}/songs`);
      const songs = await response.json();
      setSongs(songs);
    };

    getSongs();
  }, []);

  const deleteSong = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this song?');
    if (confirmDelete) {
        try {
            await axios.delete(`${baseUrl}/songs/${id}`);
            setSongs(songs.filter(song => song._id !== id));
          } catch (error) {
            console.error(error);
          }
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