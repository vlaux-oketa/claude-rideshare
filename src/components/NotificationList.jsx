import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';

function NotificationList() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', currentUser.uid),
      where('isRead', '==', false),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifArr = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setNotifications(notifArr);
      setLoading(false);
      console.log('Fetched notifications:', notifArr);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  async function handleMarkAsRead(notificationId) {
    const notificationDocRef = doc(db, 'notifications', notificationId);
    try {
      await updateDoc(notificationDocRef, { isRead: true });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid blue' }}>
      <h4>Notifications</h4>
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map(notif => (
            <li key={notif.id} style={{ marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px dashed #ccc' }}>
              {notif.message}
              <br />
              <small>Received: {notif.timestamp?.seconds ? new Date(notif.timestamp.seconds * 1000).toLocaleTimeString() : 'Unknown'}</small>
              <button onClick={() => handleMarkAsRead(notif.id)} style={{ marginLeft: '10px', fontSize: '0.8em' }}>Mark as Read</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationList;
