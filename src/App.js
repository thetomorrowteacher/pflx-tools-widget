import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ClassSelector from './components/ClassSelector';
import TeamGenerator from './components/TeamGenerator';
import PlayerRandomizer from './components/PlayerRandomizer';
import './styles/App.css';
import './styles/embed.css';

function App() {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // Check if application is embedded via iframe
    const urlParams = new URLSearchParams(window.location.search);
    const embedParam = urlParams.get('embed');
    
    if (embedParam === 'true') {
      setIsEmbedded(true);
      document.body.classList.add('embedded');
    }
  }, []);

  return (
    <div className={`app-container ${isEmbedded ? 'embedded-app' : ''}`}>
      <Router>
        <Routes>
          <Route path="/" element={<ClassSelector isEmbedded={isEmbedded} />} />
          <Route path="/teams/:classId" element={<TeamGenerator isEmbedded={isEmbedded} />} />
          <Route path="/randomizer/:classId" element={<PlayerRandomizer isEmbedded={isEmbedded} />} />
        </Routes>
      </Router>
      
      {!isEmbedded && (
        <div className="embed-instructions">
          <h3>Want to embed this widget?</h3>
          <p>Check out our <a href={process.env.PUBLIC_URL + '/embed-code.html'} target="_blank" rel="noopener noreferrer">embed instructions</a>.</p>
        </div>
      )}
    </div>
  );
}

export default App;