// Taken from https://supabase.com/docs/guides/auth/quickstarts/react
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './App'


export default function AuthComponent() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  
  const [verifying, setVerifying] = useState(false)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/')
      }
    })

    const params = new URLSearchParams(window.location.search)
    const token_hash = params.get('token_hash')
    const type = params.get('type')
    
    if (token_hash) {
      setVerifying(true)
      // Verify the OTP token
      supabase.auth.verifyOtp({
        token_hash,
        type: type || 'email',
      }).then(({ error }) => {
        if (error) {
          setAuthError(error.message)
          setVerifying(false)
        } else {
          window.history.replaceState({}, document.title, '/login')
          navigate('/')
        }
      })
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/login',
      }
    })
    
    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  if (verifying) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Authentication</h2>
        <p>Confirming your magic link...</p>
        <p>Loading...</p>
      </div>
    )
  }

  if (authError) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Authentication</h2>
        <p>✗ Authentication failed</p>
        <p>{authError}</p>
        <button
          onClick={() => {
            setAuthError(null)
            window.history.replaceState({}, document.title, '/login')
          }}
        >
          Return to login
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Sign In</h2>
      <p>Sign in via magic link with your email below</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <button disabled={loading} style={{ padding: '10px', width: '100%' }}>
          {loading ? 'Loading...' : 'Send magic link'}
        </button>
      </form>
    </div>
  )
}