import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [studentsData, setStudentsData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load default data when the app first loads
  useEffect(() => {
    loadDefaultData();
  }, []);

  // Process the student data to extract unique classes
  const processStudentData = (data) => {
    if (!data || data.length === 0) {
      setError('No student data found');
      setIsLoading(false);
      return;
    }

    try {
      // Set the student data
      setStudentsData(data);

      // Extract unique classes
      const uniqueClasses = [...new Set(data.map(student => student.class))];
      
      // Create class objects with IDs and names
      const classObjects = uniqueClasses.map((className, index) => ({
        id: index + 1,
        name: className,
        studentCount: data.filter(student => student.class === className).length
      }));

      setClasses(classObjects);
      setError(null);
    } catch (err) {
      setError('Error processing student data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load default student data from CSV
  const loadDefaultData = () => {
    setIsLoading(true);
    
    // Try multiple possible locations for the CSV file
    const tryFetchCSV = (paths, index = 0) => {
      if (index >= paths.length) {
        console.warn('Could not load CSV from any path, using fallback data');
        // Use hardcoded fallback data instead of failing
        const fallbackData = [
          { id: "1", name: "Student 1", class: "Science 10A" },
          { id: "2", name: "Student 2", class: "Science 10A" },
          { id: "3", name: "Student 3", class: "Science 10A" },
          { id: "4", name: "Student 4", class: "Science 10A" },
          { id: "5", name: "Student 5", class: "Math 9B" },
          { id: "6", name: "Student 6", class: "Math 9B" },
          { id: "7", name: "Student 7", class: "Math 9B" },
          { id: "8", name: "Student 8", class: "Humanities 8C" },
          { id: "9", name: "Student 9", class: "Humanities 8C" },
          { id: "10", name: "Student 10", class: "Humanities 8C" }
        ];
        processStudentData(fallbackData);
        return;
      }
      
      fetch(paths[index])
        .then(response => {
          if (!response.ok) {
            throw new Error('CSV not found at this path');
          }
          return response.text();
        })
        .then(csvText => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              processStudentData(results.data);
            },
            error: (error) => {
              console.error('CSV parsing error:', error);
              tryFetchCSV(paths, index + 1);
            }
          });
        })
        .catch(err => {
          console.log(`Tried path ${paths[index]}, moving to next path...`);
          tryFetchCSV(paths, index + 1);
        });
    };
    
    tryFetchCSV([
      './students.csv',
      '/students.csv',
      './static/media/students.csv',
      process.env.PUBLIC_URL + '/students.csv',
      process.env.PUBLIC_URL + '/static/media/students.csv'
    ]);
  };

  // Upload custom student data from a CSV file
  const uploadCustomData = (file) => {
    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Get columns from the CSV
          const columns = Object.keys(results.data[0] || {});
          
          // Check if we have first_name/last_name OR name
          const hasFirstLastName = columns.includes('first_name') && columns.includes('last_name');
          const hasName = columns.includes('name');
          
          // Check if we have a class column
          const hasClass = columns.includes('class');
          
          // Validate required columns
          if ((!hasFirstLastName && !hasName) || !hasClass) {
            const missingFields = [];
            if (!hasFirstLastName && !hasName) missingFields.push('first_name & last_name OR name');
            if (!hasClass) missingFields.push('class');
            
            setError(`CSV is missing required columns: ${missingFields.join(', ')}`);
            setIsLoading(false);
            return;
          }
          
          // Process the data and convert to consistent format
          const processedData = results.data.map((student, index) => {
            // Create a unique ID if none exists
            const id = student.id || `custom-${index + 1}`;
            
            // Handle name formats
            let name;
            if (hasFirstLastName) {
              name = `${student.first_name} ${student.last_name}`;
            } else {
              name = student.name;
            }
            
            // Return standardized student object
            return {
              id: id,
              name: name,
              class: student.class,
              // Preserve any other fields
              ...Object.keys(student)
                .filter(key => !['id', 'name', 'first_name', 'last_name', 'class'].includes(key))
                .reduce((obj, key) => {
                  obj[key] = student[key];
                  return obj;
                }, {})
            };
          });
          
          processStudentData(processedData);
        } catch (err) {
          console.error("Error processing CSV:", err);
          setError('Error processing CSV: ' + (err.message || 'Invalid format'));
          setIsLoading(false);
        }
      },
      error: (error) => {
        setError('Error parsing CSV: ' + error.message);
        setIsLoading(false);
      }
    });
  };

  // Get students by class ID
  const getStudentsByClass = (classId) => {
    const classObj = classes.find(c => c.id === parseInt(classId));
    
    if (!classObj) {
      return [];
    }
    
    return studentsData.filter(student => student.class === classObj.name);
  };

  return (
    <StudentContext.Provider value={{
      studentsData,
      classes,
      isLoading,
      error,
      loadDefaultData,
      uploadCustomData,
      getStudentsByClass
    }}>
      {children}
    </StudentContext.Provider>
  );
};