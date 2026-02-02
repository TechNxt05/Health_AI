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
        textShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
        fontSize: '2rem',
        fontWeight: '900',
        letterSpacing: '1px'
      }}>HEALTHAI</div>
      <div className="links">
        <ul className="ulLinks">
          {[
            { name: 'Home', path: '/' },
            { name: 'Chat Bot', path: '/chatbot' },
            { name: 'Disease Diagnosis', path: '/diagonsis' },
          ].map((item) => (
            <li className="linkItem" key={item.name}>
              <a href={item.path} style={{ color: 'var(--text-primary)', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{item.name}</a>
            </li>
          ))}

          <li className="linkItem" onClick={() => handleMenuClick(analyseImage)} style={{ color: 'var(--text-primary)', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.8)', cursor: 'pointer' }}>
            Image Analysis
          </li>
          <li className="linkItem" onClick={() => handleMenuClick(dataset)} style={{ color: 'var(--text-primary)', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.8)', cursor: 'pointer' }}>
            Dataset Generation
          </li>
          {showPopUp && <PopUp onClose={() => setShowPopUp(false)} data={popUpData} />}

          <li className="linkItem">
            <a href="/doctors-profile" style={{ color: 'var(--text-primary)', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Connect with Doctor</a>
          </li>
          <li className="linkItem">
            <a href="/druggeneration" style={{ color: 'var(--text-primary)', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Drug Generation</a>
          </li>
        </ul>
      </div>
      {user ? (<ProfileOverlay></ProfileOverlay>) : (<div className='flex gap-4 justify-center'>
        <a href="/login" className='text-sm font-semibold rounded-full bg-white text-indigo-600 hover:bg-slate-100 py-2 px-6 transition-all shadow-md hover:shadow-lg'>Login</a>
        <a href="/signup" className='text-sm font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-6 transition-all shadow-md hover:shadow-lg border border-indigo-500'>SignUp</a>
      </div>)}

    </div>
  );
}

export default ResponsiveAppBar;
