// React and routing imports
// React and routing imports
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MapDisplay from '../components/MapDisplay';
import RideRequestForm from '../components/RideRequestForm';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // State for rides
  const [rides, setRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(true);

  useEffect(() => {
    // Make sure currentUser is loaded before querying
    if (!currentUser) {
      setRides([]); // Clear rides if user logs out
      setLoadingRides(false);
      return;
    }

    setLoadingRides(true);
    // Query Firestore for rides belonging to the current user, ordered by creation time
    const ridesCollectionRef = collection(db, 'rides');
    const q = query(
      ridesCollectionRef,
      where("riderId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    // Set up a real-time listener using onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userRides = [];
      querySnapshot.forEach((doc) => {
        userRides.push({ id: doc.id, ...doc.data() });
      });
      setRides(userRides);
      setLoadingRides(false);
      console.log("Current rides fetched: ", userRides);
    }, (error) => {
      console.error("Error fetching rides: ", error);
      setLoadingRides(false);
    });

    // Cleanup listener when component unmounts or currentUser changes
    return () => unsubscribe();
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Failed to log out');
    }
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {currentUser && currentUser.email}</p>
      <p><Link to="/profile">Edit Profile</Link></p>
      {/* Add input field above the map */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          id="address-input"
          placeholder="Search for a place or address..."
          style={{ width: '80%', padding: '8px' }}
        />
      </div>
      {/* Existing map display */}
      <div style={{ marginTop: '20px' }}>
        <MapDisplay />
      </div>
      <div style={{ marginTop: '20px' }}>
        <RideRequestForm />
      </div>

      {/* Section to display ride requests */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>My Ride Requests</h3>
        {loadingRides ? (
          <p>Loading your ride requests...</p>
        ) : rides.length === 0 ? (
          <p>You have no active or past ride requests.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {rides.map((ride) => (
              <li key={ride.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', marginBottom: '10px' }}>
                <strong>Origin:</strong> {ride.originAddress || 'N/A'} <br />
                <strong>Destination:</strong> {ride.destinationAddress || 'N/A'} <br />
                <strong>Status:</strong> {ride.status || 'N/A'} <br />
                {ride.createdAt?.seconds && (
                  <small>Requested: {new Date(ride.createdAt.seconds * 1000).toLocaleString()}</small>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}