import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import "../styles/landing.css";
import logo from "../assets/iste_logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';




function Landing() {
  document.title = "Coding - Panorama | ISTE Students' Chapter NIT Durgapur"

  // firebase configurations, do not change
  const [authState, setAuthState] = useState({
    isSignedIn: false,
    pending: true,
    user: null,
  })

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user =>
      setAuthState({ user, pending: false, isSignedIn: !!user })
    )
    return () => unregisterAuthObserver()
  }, [])

  const navigate = useNavigate()
  // necessary condition checking if user is signed in or not
  if (authState.pending) {
    return (<img src={logo} alt="Logo" style={{ height: 20, marginTop: 250 }} />)
  }
  else if (authState.isSignedIn)
    navigate('/game', { replace: true });

  return (
    <div className="landing-page">
      <header className="header">
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero-section">
        <h1>Welcome to Coding Website</h1>
        <p>Learn, Code, Succeed!</p>
        <a href="./auth" className="cta-button">Get Started</a>
      </section>

      <section className="features-section">
        <div className="feature">
          <h2>Learn</h2>
          <p>Access a wide range of coding tutorials and courses to enhance your skills.</p>
        </div>
        <div className="feature">
          <h2>Code</h2>
          <p>Practice coding with real-world projects and challenges.</p>
        </div>
        <div className="feature">
          <h2>Succeed</h2>
          <p>Prepare for interviews, build your portfolio, and excel in your coding career.</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2023 Coding Website. All rights reserved.</p>
      </footer>



    </div>

  )
}

export default Landing