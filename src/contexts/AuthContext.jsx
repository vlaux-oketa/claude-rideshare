import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  // updateProfile // We might need this later for setting display name
} from 'firebase/auth';
import { app } from '../firebase/firebase'; // Adjust path if your firebase config file is elsewhere

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook for using the context easily
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Create the Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check if auth state is loaded

  const auth = getAuth(app); // Initialize Firebase Auth

  // --- Authentication Functions ---

  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // You might want to update the user profile here later (e.g., set display name)
      // await updateProfile(userCredential.user, { displayName: name });
      console.log("Signup successful:", userCredential.user);
      return userCredential; // Return the credential or user if needed
    } catch (error) {
      console.error("Signup failed:", error.code, error.message);
      throw error; // Re-throw the error so the component can handle it
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Login failed:", error.code, error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error.code, error.message);
      throw error;
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent");
    } catch (error) {
      console.error("Password reset failed:", error.code, error.message);
      throw error;
    }
  }

  // --- Monitor Auth State ---

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set user to null if logged out, or user object if logged in
      setLoading(false); // Auth state has been checked, no longer loading
      console.log("Auth state changed, current user:", user ? user.uid : null);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [auth]); // Rerun effect if auth object changes (shouldn't normally)

  // --- Value Provided by Context ---

  const value = {
    currentUser,
    loading, // Include loading state
    signup,
    login,
    logout,
    resetPassword,
  };

  // Provide the value to child components
  // Only render children when loading is false to prevent rendering routes prematurely
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}