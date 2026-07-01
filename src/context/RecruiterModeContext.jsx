import React, { createContext, useContext, useState, useEffect } from 'react';

const RecruiterModeContext = createContext();

export const RecruiterModeProvider = ({ children }) => {
  const [isRecruiterMode, setIsRecruiterMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('recruiterMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('recruiterMode', isRecruiterMode);
    
    // Optionally add a class to body to control global CSS styles
    if (isRecruiterMode) {
      document.body.classList.add('recruiter-mode');
    } else {
      document.body.classList.remove('recruiter-mode');
    }
  }, [isRecruiterMode]);

  const toggleRecruiterMode = () => setIsRecruiterMode(prev => !prev);

  return (
    <RecruiterModeContext.Provider value={{ isRecruiterMode, toggleRecruiterMode, setIsRecruiterMode }}>
      {children}
    </RecruiterModeContext.Provider>
  );
};

export const useRecruiterMode = () => {
  const context = useContext(RecruiterModeContext);
  if (context === undefined) {
    throw new Error('useRecruiterMode must be used within a RecruiterModeProvider');
  }
  return context;
};
