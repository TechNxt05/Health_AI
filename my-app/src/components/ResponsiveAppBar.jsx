import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import 'reactjs-popup/dist/index.css';
import PopUp from '../PopUp';
import DataContext from '../context/dataContext';
import ProfileOverlay from './Auth/ProfileOverlay';
function ResponsiveAppBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState(null); // Store dynamic data for the pop-up
  const { user } = useContext(DataContext);
  const analyseImage = {
    headText: 'Image Analysis',
    button1Text: 'Image Diagnosis',
    button1Route: '/uploadImage',
    button2Text: 'Medical Report',
    button2Route: '/handle-uploader',
  };

  const dataset = {
    headText: 'Dataset Generation',
    button1Text: 'From Sample',
    button1Route: '/generateDataFromSample',
    button2Text: 'From Field',
    button2Route: '/generateData',
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenuClick = (data) => {
    setPopUpData(data);
    setShowPopUp(true);
  };

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{
      background: isScrolled ? 'var(--glass-bg)' : 'linear-gradient(to bottom, rgba(2, 6, 23, 0.9) 0%, rgba(2, 6, 23, 0) 100%)',
      backdropFilter: 'blur(8px)',
      borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none',
      transition: 'all 0.3s ease-in-out',
      boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : 'none'
    }}>
      <div className="logo" style={{
        color: 'var(--text-primary)',
        textShadow: '0 0 20px rgba(6, 182, 212, 0.5)', // Softer, more spread out glow
        fontSize: '1.8rem', // Slightly smaller for elegance
        fontWeight: '800',
        letterSpacing: '2px', // More spacing
        background: 'linear-gradient(to right, #22d3ee, #60a5fa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>HEALTHAI</div>
      <div className="links">
        <ul className="ulLinks" style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center' }}>
          {[
            { name: 'Home', path: '/' },
            { name: 'Chat Bot', path: '/chatbot' },
            { name: 'Disease Diagnosis', path: '/diagonsis' },
          ].map((item) => (
            <li className="linkItem" key={item.name}>
              <a href={item.path} style={{ color: 'var(--text-secondary)', fontWeight: '500', transition: 'color 0.3s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >{item.name}</a>
            </li>
          ))}

          <li className="linkItem" onClick={() => handleMenuClick(analyseImage)} style={{ color: 'var(--text-secondary)', fontWeight: '500', cursor: 'pointer', transition: 'color 0.3s' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Image Analysis
          </li>
          <li className="linkItem" onClick={() => handleMenuClick(dataset)} style={{ color: 'var(--text-secondary)', fontWeight: '500', cursor: 'pointer', transition: 'color 0.3s' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Dataset Generation
          </li>
          {showPopUp && <PopUp onClose={() => setShowPopUp(false)} data={popUpData} />}

          <li className="linkItem">
            <a href="/doctors-profile" style={{ color: 'var(--text-secondary)', fontWeight: '500', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >Connect with Doctor</a>
          </li>
          <li className="linkItem">
            <a href="/druggeneration" style={{ color: 'var(--text-secondary)', fontWeight: '500', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >Drug Generation</a>
          </li>
        </ul>
      </div>
      {user ? (<ProfileOverlay></ProfileOverlay>) : (<div className='flex gap-4 justify-center'>
        <a href="/login" className='linkItem' style={{ padding: '0.5rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>Login</a>
        <a href="/signup" className='linkItem' style={{ padding: '0.5rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>SignUp</a>
      </div>)}

    </div>
  );
}

export default ResponsiveAppBar;
