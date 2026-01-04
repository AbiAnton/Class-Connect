import React, { useEffect, useState, useContext } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import AuthComponent from './Auth'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
 	const [user, setUser] = useState(null);
 	const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    //First load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session){
        setIsLoggedIn(true)
        setUser(session.user)
      } else{
        setIsLoggedIn(false)
        setUser(null)
      }
    });

    // Every time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session){
        setIsLoggedIn(true)
        setUser(session.user)
      } else{
        setIsLoggedIn(false)
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, []);

  const login = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout}}>{children}</AuthContext.Provider>
  );
}


function App() {
  const [savedProfiles, setSavedProfiles] = useState(0) // Need to put this here so both Home and Saved Can use it

  return (
    <AuthProvider>
      <BrowserRouter>
        <nav>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit'}} aria-label='Home'>Home</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }} aria-label='About'>About</Link>
          <Link to="/saved" style={{ textDecoration: 'none', color: 'inherit' }} aria-label='Saved Profiles'>Saved Profiles: {savedProfiles}</Link>
          <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }} aria-label='Settings'>Settings</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home savedProfiles={savedProfiles} setSavedProfiles={setSavedProfiles} />} />       
          <Route path="/about" element={<About />} />
          <Route path="/saved" element={<SavedProfiles savedProfiles={savedProfiles} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<AuthComponent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
} 

function Home({savedProfiles, setSavedProfiles}) {
  const { user, isLoggedIn } = useContext(AuthContext)
  
  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Please log in to view profiles</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    )
  }
  
  useEffect(() => {
    console.log('There are ' + savedProfiles + ' saved profiles.')
  }, [savedProfiles]) // Dependency array means log whenever savedProfiles changes. https://www.youtube.com/watch?v=YxkcMszKEYY

  // Store users in a state variable
  const [users, setUsers] = useState([])

  useEffect(() => {
  // Taken from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  async function getData() {
    // NOTE TO SELF: Will only work when you have the server running
    const url = "http://localhost:3005/users/profiles";
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
      const result = await response.json();
      setUsers(result);
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }
  }
  
    getData();
  }, []) // Empty dependency array means only load once

  return (
    <main>
      <button aria-label='Filter Profiles' style={{marginLeft: 'auto'}}>Filter</button>
      <div className='profiles-list'>
       {users.map((user) => (
        // NOTE: Choosing not to include birthday, even though it's in user_profiles, because I think it would be odd to display here
          <Profile 
            key={user.id} // Not part of props
            name={user.first_name + ' ' + user.last_name}
            shared_classes={3}
            similar_interests={5}
            bio={user.user_profiles?.bio || 'No bio available'}
            save={() => setSavedProfiles(savedProfiles + 1)}
          />
        ))}
      </div>
    </main>
  )
}

function About() {
  return (
    <div>
      <h1>About This App</h1>
      <p>This app helps you find and save profiles with similar interests and shared classes.</p>
    </div>
  )
}

function SavedProfiles({savedProfiles}) {
  return (
    <div>
      <h1>Saved Profiles</h1>
      <p>You have {savedProfiles} saved profiles.</p>
    </div>
  )
}

function Settings() { 
  return (
    <div>
      <h1>Settings</h1>
      <p>Change your settings here.</p>
    </div>
  )
}

function Profile({name, shared_classes, similar_interests, bio, save}){
  return(
    <div className='profile-card' aria-label={name}>
      <div className='profile-picture'>
        <button className='save-button' aria-label="Save" onClick={save}>Save</button>
      </div>
      <h3 style={{fontWeight: 'bold', margin: '0.5rem 0'}}>{name}</h3>
      <p style={{margin: '0.25rem 0'}}>{shared_classes} shared classes</p>
      <p style={{margin: '0.25rem 0'}}>{similar_interests} similar interests</p>
      <p style={{margin: '0.25rem 0'}}>{bio}</p>
    </div>
  )
}

export default App