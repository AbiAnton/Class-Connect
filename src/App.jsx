import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'

function App() {
  const [savedProfiles, setSavedProfiles] = useState(0) // Need to put this here so both About and Saved Can use it

  return (
    <BrowserRouter>
      <navbar>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit'}} aria-label='Home'>Home</Link>
        <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }} aria-label='About'>About</Link>
        <Link to="/saved" style={{ textDecoration: 'none', color: 'inherit' }} aria-label='Saved Profiles'>Saved Profiles: {savedProfiles}</Link>
        <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }} aria-label='Settings'>Settings</Link>
      </navbar>

      <Routes>
        <Route path="/" element={<Home savedProfiles={savedProfiles} setSavedProfiles={setSavedProfiles} />} />
        <Route path="/about" element={<About />} />
        <Route path="/saved" element={<SavedProfiles savedProfiles={savedProfiles} />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
} 

function Home({savedProfiles, setSavedProfiles}) {
  useEffect(() => {
    console.log('There are ' + savedProfiles + ' saved profiles.')
  }, [])

  // Store users in a state variable
  const [users, setUsers] = useState([])

  useEffect(() => {

    // Taken from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      async function getData() {
      const url = "https://disc-assignment-5-users-api-iyct.onrender.com/api/users";
      try {
        const response = await fetch(url);
        if (!response.ok) { //Error
          throw new Error(`Response status: ${response.status}`);
        }
        
        // If response is okay
        const result = await response.json();
        setUsers(result);
        console.log(result);
      } catch (error) {
        console.error(error.message);
      }
    }

    getData();

  }, []) 

  return (
    <main>
      <button aria-label='Filter Profiles' style={{marginLeft: 'auto'}}>Filter</button>
      <div className='profiles-list'>
       {users.map((user) => (
          <Profile 
            key={user.id}
            name={user.firstName + ' ' + user.lastName}
            shared_classes={3}
            similar_interests={5}
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

function Profile({name, shared_classes, similar_interests, save}){
  return(
    <div className='profile-card' aria-label={name}>
      <div className='profile-picture'>
        <button className='save-button' aria-label="Save" onClick={save}>Save</button>
      </div>
      <h3 style={{fontWeight: 'bold', margin: '0.5rem 0'}}>{name}</h3>
      <p style={{margin: '0.25rem 0'}}>{shared_classes} shared classes</p>
      <p style={{margin: '0.25rem 0'}}>{similar_interests} similar interests</p>
    </div>
  )
}

export default App