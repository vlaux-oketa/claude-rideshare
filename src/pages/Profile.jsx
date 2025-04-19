import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, storage } from '../firebase/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function Profile() {
  const { currentUser } = useAuth()
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('rider')
  const [photoURL, setPhotoURL] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return
      try {
        const docRef = doc(db, 'users', currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setFullName(data.fullName || '')
          setRole(data.role || 'rider')
          setPhotoURL(data.photoURL || '')
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [currentUser])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      let newPhotoURL = photoURL
      if (file) {
        const avatarRef = storageRef(storage, `avatars/${currentUser.uid}`)
        await uploadBytes(avatarRef, file)
        newPhotoURL = await getDownloadURL(avatarRef)
      }
      const docRef = doc(db, 'users', currentUser.uid)
      await setDoc(docRef, { fullName, role, photoURL: newPhotoURL }, { merge: true })
      setPhotoURL(newPhotoURL)
      setMessage('Profile saved')
    } catch (err) {
      console.error(err)
      setError('Failed to save profile')
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="rider">Rider</option>
            <option value="driver">Driver</option>
          </select>
        </div>
        <div>
          <label>Profile Photo (optional)</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        </div>
        <button type="submit">Save Profile</button>
      </form>
      {photoURL && (
        <div>
          <p>Current Photo:</p>
          <img src={photoURL} alt="Profile" width={100} />
        </div>
      )}
    </div>
  )
}