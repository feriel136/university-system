import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Events.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date_event: '', location: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.post('http://localhost:3100/api/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Erreur fetchEvents:', error);
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3100/api/events', form);
      setForm({ title: '', description: '', date_event: '', location: '' });
      fetchEvents();
    } catch (error) {
      console.error('Erreur handleSubmit:', error);
    }
  };

  return (
    <div className="events-container">
      <h2 className="events-title">Événements scolaires</h2>

      <form className="events-form" onSubmit={handleSubmit}>
        <input
          className="events-input"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Titre"
          required
        />
        <textarea
          className="events-textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          className="events-input"
          type="date"
          name="date_event"
          value={form.date_event}
          onChange={handleChange}
          required
        />
        <input
          className="events-input"
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Lieu"
        />
        <button className="events-button" type="submit">Ajouter</button>
      </form>

      <ul className="events-list">
        {events.map(e => (
          <li className="events-item" key={e.id}>
            <b className="events-item-title">{e.title}</b> le <span className="events-item-date">{e.date_event}</span> à <span className="events-item-location">{e.location}</span><br />
            <p className="events-item-description">{e.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
