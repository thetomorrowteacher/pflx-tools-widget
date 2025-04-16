import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StudentContext } from '../context/StudentContext';
import '../styles/PlayerRandomizer.css';

const PlayerRandomizer = ({ isEmbedded }) => {
  const { classId } = useParams();
  const { getStudentsByClass, classes } = useContext(StudentContext);
  const [students, setStudents] = useState([]);
  const [className, setClassName] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previouslySelected, setPreviouslySelected] = useState([]);

  useEffect(() => {
    try {
      // Get students for this class
      const classStudents = getStudentsByClass(classId) || [];
      setStudents(classStudents);
      
      // Find the class name
      const classObj = classes.find(c => c.id === parseInt(classId));
      if (classObj) {
        setClassName(classObj.name);
      } else {
        setClassName('Class'); // Default fallback
      }
    } catch (error) {
      console.error("Error loading randomizer data:", error);
      // Continue with empty data rather than crashing
      setStudents([]);
      setClassName('Class');
    }
  }, [classId, getStudentsByClass, classes]);

  const selectRandomStudent = () => {
    if (students.length === 0) return;
    
    // If all students have been selected, reset the list
    if (previouslySelected.length >= students.length) {
      setPreviouslySelected([]);
    }
    
    // Filter out previously selected students
    const availableStudents = students.filter(
      student => !previouslySelected.includes(student.id)
    );
    
    if (availableStudents.length === 0) return;
    
    // Start the animation
    setIsAnimating(true);
    setSelectedStudent(null);
    
    // Randomly cycle through students for visual effect
    let counter = 0;
    const maxCycles = 20;
    const cycleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      setSelectedStudent(students[randomIndex]);
      
      counter++;
      if (counter >= maxCycles) {
        clearInterval(cycleInterval);
        
        // Select the final student
        const randomIndex = Math.floor(Math.random() * availableStudents.length);
        const finalStudent = availableStudents[randomIndex];
        setSelectedStudent(finalStudent);
        setPreviouslySelected([...previouslySelected, finalStudent.id]);
        setIsAnimating(false);
      }
    }, 100);
  };

  const resetSelection = () => {
    setPreviouslySelected([]);
    setSelectedStudent(null);
  };

  return (
    <div className="randomizer-container">
      <header className="randomizer-header">
        <div className="header-left">
          <Link to="/" className="back-button">
            ← Back
          </Link>
          <h1>{className} Randomizer</h1>
        </div>
      </header>
      
      <div className="randomizer-content">
        <div className={`student-display ${isAnimating ? 'animating' : ''} ${selectedStudent ? 'has-student' : ''}`}>
          {selectedStudent ? (
            <div className="selected-student">
              <div className="student-name">{selectedStudent.name}</div>
            </div>
          ) : (
            <div className="placeholder">Click the button to select a random student</div>
          )}
        </div>
        
        <div className="randomizer-controls">
          <button 
            className="randomize-button" 
            onClick={selectRandomStudent}
            disabled={isAnimating || students.length === 0}
          >
            {isAnimating ? 'Selecting...' : 'Select Random Student'}
          </button>
          
          <button 
            className="reset-button" 
            onClick={resetSelection}
            disabled={!previouslySelected.length}
          >
            Reset Selection History
          </button>
        </div>
        
        {previouslySelected.length > 0 && (
          <div className="selection-history">
            <h3>Selection History</h3>
            <div className="history-count">
              {previouslySelected.length} of {students.length} students selected
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerRandomizer;