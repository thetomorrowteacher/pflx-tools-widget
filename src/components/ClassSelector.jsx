import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { StudentContext } from '../context/StudentContext';
import '../styles/ClassSelector.css';

const ClassSelector = ({ isEmbedded }) => {
  const { classes, isLoading, error, uploadCustomData, loadDefaultData } = useContext(StudentContext);
  const [fileError, setFileError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    if (file.type !== 'text/csv') {
      setFileError("Please upload a CSV file");
      return;
    }
    
    try {
      uploadCustomData(file);
      setFileError("");
      setUploadSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      setFileError("Error uploading file: " + err.message);
    }
  };

  const handleResetToDefault = () => {
    loadDefaultData();
  };

  return (
    <div className="class-selector-container">
      <div className="class-selector-header">
        <h1 className="title">PFLX Class Tools</h1>
        {!isEmbedded && <div className="subtitle">Select a class to continue</div>}
      </div>
      
      {isLoading ? (
        <div className="loading">Loading class data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="classes-grid">
            {classes.map((classItem) => (
              <div className="class-card" key={classItem.id}>
                <h2>{classItem.name}</h2>
                <p>{classItem.studentCount} students</p>
                <div className="class-card-actions">
                  <Link 
                    to={`/teams/${classItem.id}`} 
                    className="button team-button"
                  >
                    Create Teams
                  </Link>
                  <Link 
                    to={`/randomizer/${classItem.id}`} 
                    className="button randomizer-button"
                  >
                    Random Student
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {!isEmbedded && (
            <div className="csv-upload-section">
              <h3>Upload Custom Class Data</h3>
              <p>Upload a CSV file with student data in one of these formats:</p>
              <ul className="csv-format-list">
                <li><strong>Option 1:</strong> <code>first_name, last_name, class</code> columns</li>
                <li><strong>Option 2:</strong> <code>name, class</code> columns (full name in one field)</li>
              </ul>
              
              <div className="template-download">
                <a 
                  href="./template.csv" 
                  download="student_roster_template.csv"
                  className="template-link"
                >
                  Download Template CSV
                </a>
              </div>
              
              <div className="file-upload-container">
                <input 
                  type="file" 
                  id="csv-upload" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="file-input"
                />
                <label htmlFor="csv-upload" className="file-upload-button">
                  Choose CSV File
                </label>
                
                <button 
                  onClick={handleResetToDefault} 
                  className="reset-button"
                >
                  Reset to Default Data
                </button>
              </div>
              
              {fileError && <div className="upload-error">{fileError}</div>}
              {uploadSuccess && <div className="upload-success">File uploaded successfully!</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClassSelector;