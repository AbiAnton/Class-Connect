import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Profile({name, shared_classes, similar_interests}){
  return(
    <div>
      <h3>{name}</h3>
      <p>Shared Classes: {shared_classes}</p>
      <p>Similar Interests: {similar_interests}</p>
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
      <div>
        <button aria-label='Filter Profiles'>Filter</button>
      </div>
    </main>
  )
}

export default App
