import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

function RideRequestForm() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!currentUser) {
      setError("You must be logged in to request a ride.");
      return;
    }
    if (!origin || !destination) {
      setError("Please enter both origin and destination.");
      return;
    }
    setError('');
    setLoading(true);

    const newRide = {
      riderId: currentUser.uid,
      riderEmail: currentUser.email,
      originAddress: origin,
      destinationAddress: destination,
      status: 'requested',
      rideType: 'Standard',
      createdAt: serverTimestamp()
    };

    try {
      const ridesCollectionRef = collection(db, 'rides');
      const docRef = await addDoc(ridesCollectionRef, newRide);
      console.log("Ride request saved successfully with ID: ", docRef.id);
      alert("Ride requested successfully!");
      setOrigin('');
      setDestination('');
    } catch (err) {
      console.error("Error saving ride request: ", err);
      setError("Failed to request ride. Please check console and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Request a Ride</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Origin:</label>
          <input
            type="text"
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            required
          />
        </div>
        <p>Ride Type: Standard (only)</p>
        <p>Estimated Fare: TBD</p>
        <button type="submit" disabled={loading}>
          {loading ? 'Requesting...' : 'Request Ride'}
        </button>
      </form>
    </div>
  );
}

export default RideRequestForm;
