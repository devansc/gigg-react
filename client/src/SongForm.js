// SongForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SongForm() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const song = { title, sections: [] };

    const baseUrl = process.env.SERVER_URL || "http://localhost:9000";
    console.log("Base URL is ", baseUrl);

    const response = await fetch(baseUrl+'/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(song),
    });

    if (response.ok) {
      setTitle('');
      const savedSong = await response.json();
      console.log(savedSong); // Add this line
      navigate(`/song/${savedSong._id}`);
    } else {
      console.error('Failed to save song');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Song title"
        required
      />
      <button type="submit">Add Song</button>
    </form>
  );
}

export default SongForm;