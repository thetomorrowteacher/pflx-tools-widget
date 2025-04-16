import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { StudentContext } from '../context/StudentContext';
import '../styles/TeamGenerator.css';

const TeamGenerator = ({ isEmbedded }) => {
  const { classId } = useParams();
  const { getStudentsByClass, classes } = useContext(StudentContext);
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [className, setClassName] = useState('');

  useEffect(() => {
    try {
      // Get the students for this class
      const classStudents = getStudentsByClass(classId) || [];
      setStudents(classStudents);
      
      // Find the class name
      const classObj = classes.find(c => c.id === parseInt(classId));
      if (classObj) {
        setClassName(classObj.name);
      } else {
        setClassName('Class'); // Default fallback
      }
      
      // Initialize teams
      generateTeams(numberOfTeams, classStudents);
    } catch (error) {
      console.error("Error loading team data:", error);
      // Continue with empty data rather than crashing
      setStudents([]);
      setClassName('Class');
      setTeams([]);
    }
  }, [classId, getStudentsByClass, classes, numberOfTeams]);

  const generateTeams = (teamCount, studentList = students) => {
    try {
      // Ensure we have a valid teamCount
      const validTeamCount = Math.max(1, parseInt(teamCount) || 1);
      
      // Make a copy of the students array, ensuring it's valid
      const validStudentList = Array.isArray(studentList) ? studentList : [];
      const shuffledStudents = [...validStudentList].sort(() => Math.random() - 0.5);
      
      // Create empty teams
      const newTeams = Array(validTeamCount)
        .fill()
        .map((_, index) => ({
          id: `team-${index + 1}`,
          name: `Team ${index + 1}`,
          students: []
        }));
      
      // Distribute students among teams
      if (shuffledStudents.length > 0 && validTeamCount > 0) {
        shuffledStudents.forEach((student, index) => {
          const teamIndex = index % validTeamCount;
          newTeams[teamIndex].students.push(student);
        });
      }
      
      setTeams(newTeams);
      setNumberOfTeams(validTeamCount);
    } catch (error) {
      console.error("Error generating teams:", error);
      // Create at least one empty team rather than crashing
      setTeams([{
        id: 'team-1',
        name: 'Team 1',
        students: []
      }]);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    // Dropped outside a droppable area
    if (!destination) {
      return;
    }
    
    // Same team, reordering
    if (source.droppableId === destination.droppableId) {
      const teamIndex = teams.findIndex(team => team.id === source.droppableId);
      const teamCopy = {...teams[teamIndex]};
      const [movedStudent] = teamCopy.students.splice(source.index, 1);
      teamCopy.students.splice(destination.index, 0, movedStudent);
      
      const newTeams = [...teams];
      newTeams[teamIndex] = teamCopy;
      setTeams(newTeams);
    } 
    // Moving between teams
    else {
      const sourceTeamIndex = teams.findIndex(team => team.id === source.droppableId);
      const destTeamIndex = teams.findIndex(team => team.id === destination.droppableId);
      
      const sourceTeamCopy = {...teams[sourceTeamIndex]};
      const destTeamCopy = {...teams[destTeamIndex]};
      
      const [movedStudent] = sourceTeamCopy.students.splice(source.index, 1);
      destTeamCopy.students.splice(destination.index, 0, movedStudent);
      
      const newTeams = [...teams];
      newTeams[sourceTeamIndex] = sourceTeamCopy;
      newTeams[destTeamIndex] = destTeamCopy;
      setTeams(newTeams);
    }
  };

  const handleTeamCountChange = (e) => {
    const count = parseInt(e.target.value);
    if (count >= 1 && count <= 10) {
      setNumberOfTeams(count);
    }
  };

  const shuffleTeams = () => {
    generateTeams(numberOfTeams);
  };

  return (
    <div className="team-generator-container">
      <header className="team-generator-header">
        <div className="header-left">
          <Link to="/" className="back-button">
            ← Back
          </Link>
          <h1>{className} Teams</h1>
        </div>
        
        <div className="team-controls">
          <div className="team-count-control">
            <label htmlFor="team-count">Teams:</label>
            <input
              id="team-count"
              type="number"
              min="1"
              max="10"
              value={numberOfTeams}
              onChange={handleTeamCountChange}
            />
          </div>
          
          <button className="shuffle-button" onClick={shuffleTeams}>
            Shuffle Teams
          </button>
          
          <button className="generate-button" onClick={() => generateTeams(numberOfTeams)}>
            Regenerate
          </button>
        </div>
      </header>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="teams-container">
          {teams.map(team => (
            <div className="team-column" key={team.id}>
              <h2 className="team-name">{team.name}</h2>
              <Droppable droppableId={team.id}>
                {(provided, snapshot) => (
                  <div
                    className={`team-students ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {team.students.map((student, index) => (
                      <Draggable
                        key={student.id}
                        draggableId={student.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`student-item ${snapshot.isDragging ? 'dragging' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {student.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TeamGenerator;