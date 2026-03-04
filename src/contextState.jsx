import React, { createContext, useState } from "react";

const ActiveTabContext = createContext();

const ActiveContextProvider = ({ children }) => {
    const [activeItem, setActiveItem] = useState('Home');
    
    return (
        <ActiveTabContext.Provider value={{ activeItem, setActiveItem }}>
            {children}
        </ActiveTabContext.Provider>
    );
};

export { ActiveContextProvider, ActiveTabContext };