import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Profile({name, shared_classes, similar_interests, save}){
  return(
    <div className='profile-card' aria-label={{name}}>
      <div className='profile-picture'>
        <button className='save-button' aria-label={`Save`} onClick={save}>Save</button>
      </div>
      <h3 style={{fontWeight: 'bold', margin: '0.5rem 0'}}>{name}</h3>
      <p style={{margin: '0.25rem 0'}}>{shared_classes} shared classes</p>
      <p style={{margin: '0.25rem 0'}}>{similar_interests} similar interests</p>
    </div>
  )
}


function App() {
  const [savedProfiles, setSavedProfiles] = useState(0)


  return (
    <main>
      <navbar>
        <div aria-label='Home'>Home</div>
        <div aria-label='About'>About</div>
        <div aria-label='Saved Profiles'>Saved Profiles: {savedProfiles}</div>
        <div aria-label='Settings'>Settings</div>
      </navbar>
      <button aria-label='Filter Profiles' style={{marginLeft: 'auto'}}>Filter</button>
      <div className='profiles-list'>
        <Profile name="Alice" shared_classes={3} similar_interests={5} save={() => setSavedProfiles(savedProfiles + 1)} />
        <Profile name="Bob" shared_classes={2} similar_interests={4} save={() => setSavedProfiles(savedProfiles + 1)} />
        <Profile name="Charlie" shared_classes={4} similar_interests={6} save={() => setSavedProfiles(savedProfiles + 1)} />
        <Profile name="Diana" shared_classes={5} similar_interests={7} save={() => setSavedProfiles(savedProfiles + 1)} />
        <Profile name="Alice" shared_classes={3} similar_interests={5} save={() => setSavedProfiles(savedProfiles + 1)} />
        <Profile name="Bob" shared_classes={2} similar_interests={4} save={() => setSavedProfiles(savedProfiles + 1)} />
        <Profile name="Charlie" shared_classes={4} similar_interests={6} save={() => setSavedProfiles(savedProfiles + 1)} />
        <Profile name="Diana" shared_classes={5} similar_interests={7} save={() => setSavedProfiles(savedProfiles + 1)} />
      </div>
    </main>
  )
}

export default App
