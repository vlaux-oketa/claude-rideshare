import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, setDoc, getDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import MapDisplay from '../components/MapDisplay';

function DriverDashboard() {
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [isOnline, setIsOnline] = useState(false); // Default to offline initially
  const [statusLoading, setStatusLoading] = useState(true); // Loading state for fetching initial status

  useEffect(() => {
    // Fetch initial online status when currentUser is available
    if (!currentUser) {
      setStatusLoading(false);
      return; // Exit if no user
    }
    setStatusLoading(true);
    const userDocRef = doc(db, 'users', currentUser.uid);
    getDoc(userDocRef).then(docSnap => {
      if (docSnap.exists() && typeof docSnap.data().isOnline === 'boolean') {
        setIsOnline(docSnap.data().isOnline);
      } else {
        setIsOnline(false);
      }
      setStatusLoading(false);
    }).catch(error => {
      console.error("Error fetching initial driver status:", error);
      setIsOnline(false);
      setStatusLoading(false);
    });
  }, [currentUser]);

  async function handleToggleOnlineStatus() {
    if (!currentUser) return;
    const newStatus = !isOnline;
    const userDocRef = doc(db, 'users', currentUser.uid);
    setStatusLoading(true);
    try {
      await setDoc(userDocRef, { isOnline: newStatus }, { merge: true });
      setIsOnline(newStatus);
      console.log("Driver status updated to:", newStatus ? 'Online' : 'Offline');
      alert(`You are now ${newStatus ? 'Online' : 'Offline'}`);
    } catch (error) {
      console.error("Error updating driver status:", error);
      alert("Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  }

  useEffect(() => {
    let intervalId = null; // Variable to hold the interval ID

    // Function to get and update location
    const updateLocation = () => {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported for location updates.");
        return;
      }
      if (!currentUser) {
          console.error("No user for location update.");
          return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Position successfully retrieved
          const { latitude, longitude } = position.coords;
          const driverLocationRef = doc(db, 'driverLocations', currentUser.uid); // Doc ID = driver's UID
          const locationData = {
            latitude: latitude,
            longitude: longitude,
            timestamp: serverTimestamp() // Use server time
          };

          // Use setDoc with merge to create/update the document
          setDoc(driverLocationRef, locationData, { merge: true })
            .then(() => {
              console.log(`Driver location updated: ${latitude}, ${longitude}`);
            })
            .catch((error) => {
              console.error("Error writing driver location:", error);
            });
        },
        (error) => {
          // Error getting position
          console.error("Error getting driver location for update:", error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Geolocation options
      );
    };

    // Logic to start/stop updates based on online status
    if (isOnline && currentUser) {
      console.log("Driver went online. Starting location updates.");
      updateLocation(); // Update location immediately when going online
      intervalId = setInterval(updateLocation, 15000); // Update every 15 seconds
    } else {
      console.log("Driver is offline or not logged in. Stopping location updates.");
      // Clear interval if it exists from a previous online state
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    // Cleanup function: Clear interval when component unmounts or dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("Cleaned up location update interval.");
      }
    };
  }, [isOnline, currentUser]);

  async function handleAcceptRide(rideId, riderId) { // Added riderId parameter
    if (!currentUser) {
      console.error("No driver logged in.");
      alert("Error: You must be logged in.");
      return;
    }
    console.log(`Driver ${currentUser.uid} attempting to accept ride: ${rideId}`);
    const rideDocRef = doc(db, 'rides', rideId);
    try {
      await updateDoc(rideDocRef, {
        status: 'accepted',
        driverId: currentUser.uid
      });
      console.log("Ride accepted successfully:", rideId);

      // --- Create notification for the rider ---
      if (riderId) { // Make sure riderId was passed correctly
          const notificationsCollectionRef = collection(db, 'notifications');
          const newNotification = {
            userId: riderId, // Notify the RIDER
            message: `Your ride (ID starting ${rideId.substring(0,5)}...) has been accepted!`, // Simpler message
            timestamp: serverTimestamp(),
            isRead: false,
            type: 'ride_accepted',
            relatedRideId: rideId
          };
          try {
             await addDoc(notificationsCollectionRef, newNotification);
             console.log("Notification created for rider:", riderId);
          } catch (notifError) {
             console.error("Error creating notification:", notifError);
          }
      } else {
           console.error("Cannot create notification, riderId is missing.");
      }
      // --- End notification creation ---

      alert("Ride accepted!");
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert("Failed to accept ride. Please try again.");
    }
  }

  useEffect(() => {
    setLoading(true);
    // Query for rides with status 'requested', ordered by creation time (oldest first)
    const ridesCollectionRef = collection(db, 'rides');
    const q = query(
      ridesCollectionRef,
      where("status", "==", "requested"),
      orderBy("createdAt", "asc")
    );

    // Set up the real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rides = [];
      querySnapshot.forEach((doc) => {
        rides.push({ id: doc.id, ...doc.data() });
      });
      setAvailableRides(rides); // Update state
      setLoading(false);
      console.log("Available rides fetched: ", rides);
    }, (error) => {
      console.error("Error fetching available rides: ", error);
      setLoading(false);
      // Maybe set an error state to display
    });

    // Cleanup listener
    return () => unsubscribe();

  }, []); // Run once on mount

  return (
    <div>
      <h1>Driver Dashboard</h1>

      {/* Driver Status Toggle Section */}
      <div style={{ padding: '10px', border: '1px solid #eee', marginBottom: '20px', background: isOnline ? '#e8f5e9' : '#ffebee' }}>
        <p>Your Status: <strong>{statusLoading ? 'Loading...' : (isOnline ? 'Online (Available for rides)' : 'Offline')}</strong></p>
        <button onClick={handleToggleOnlineStatus} disabled={statusLoading}>
          {statusLoading ? 'Updating...' : (isOnline ? 'Go Offline' : 'Go Online')}
        </button>
      </div>

      {/* Add Map Display Here */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <MapDisplay />
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Available Ride Requests</h3>
        {loading ? (
          <p>Loading available rides...</p>
        ) : availableRides.length === 0 ? (
          <p>No ride requests currently available.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {availableRides.map((ride) => (
              <li key={ride.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <strong>From:</strong> {ride.originAddress || 'N/A'} <br />
                <strong>To:</strong> {ride.destinationAddress || 'N/A'} <br />
                <strong>Rider:</strong> {ride.riderEmail || ride.riderId} <br />
                {ride.createdAt?.seconds && (
                   <small>Requested: {new Date(ride.createdAt.seconds * 1000).toLocaleString()}</small>
                )}
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => handleAcceptRide(ride.id, ride.riderId)}>Accept</button>
                  <button disabled style={{ marginLeft: '10px' }}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Map can be added here later if needed */}
    </div>
  );
}

export default DriverDashboard;
