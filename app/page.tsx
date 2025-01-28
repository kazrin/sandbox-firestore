"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore"

// Firebase Settings
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Firebase Initialization
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function Home() {
  const [users, setUsers] = useState<any[]>([])
  const [newUser, setNewUser] = useState({ name: "", age: "" })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const usersCollection = collection(db, "users")
    const userSnapshot = await getDocs(usersCollection)
    const userList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setUsers(userList)
  }

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newUser.name && newUser.age) {
      await addDoc(collection(db, "users"), {
        name: newUser.name,
        age: Number.parseInt(newUser.age),
      })
      setNewUser({ name: "", age: "" })
      // fetchUsers()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Firestore Sample App</h1>

      <form onSubmit={addUser} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Age"
          value={newUser.age}
          onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add User
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name} - {user.age} years old
          </li>
        ))}
      </ul>
    </div>
  )
}

