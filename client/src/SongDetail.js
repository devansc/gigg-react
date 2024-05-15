// SongDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SongDetail.module.css';

function SongDetail() {
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [newSection, setNewSection] = useState({ name: '', value: '' });
  const { id } = useParams();
  const baseUrl = process.env.SERVER_URL || "http://localhost:9000";

  useEffect(() => {
    const getSong = async () => {
      const response = await fetch(`${baseUrl}/songs/${id}`);
      const song = await response.json();
      setSong(song);
    };

    getSong();
  }, [id]);


  const goBack = () => {
    navigate(-1);
  };

  const handleSectionChange = (field, value) => {
    setNewSection(prev => ({ ...prev, [field]: value }));
  };

  const addSection = async () => {
    const response = await fetch(`${baseUrl}/songs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...song, sections: [...song.sections, newSection] }),
    });

    if (response.ok) {
      const updatedSong = await response.json();
      setSong(updatedSong);
      setNewSection({ name: '', value: '' });
    } else {
      console.error('Failed to add section');
    }
  };

  const deleteSection = async (index) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      const updatedSections = song.sections.filter((_, i) => i !== index);
      const response = await fetch(`${baseUrl}/songs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...song, sections: updatedSections }),
      });

      if (response.ok) {
        const updatedSong = await response.json();
        setSong(updatedSong);
      } else {
        console.error('Failed to delete section');
      }
    }
  };

  return (
    <div className={styles.detail}>
      <button onClick={goBack} className={styles.backButton}>Back</button>
      {song && (
        <>
          <h1>{song.title}</h1>
          {song.sections.map((section, index) => (
            <div key={index} className={styles.section}>
                <h2>{`${section.name}: ${section.value}`}</h2>
                <button onClick={() => deleteSection(index)} className={styles.button}>X</button>
            </div>
          ))}
          <input
            type="text"
            value={newSection.name}
            onChange={(e) => handleSectionChange('name', e.target.value)}
            placeholder="Section name"
            className={styles.input}
          />
          <textarea
            value={newSection.value}
            onChange={(e) => handleSectionChange('value', e.target.value)}
            placeholder="Section details"
            className={styles.input}
          />
          <button onClick={addSection} className={styles.button}>Add Section</button>
        </>
      )}
    </div>
  );
}

export default SongDetail;