/* 
This file sets the user context inside the page, by reading from the browser session storage if the user has already logged in. Else it sets null.
*/

import React, { useState, useEffect } from "react";

export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        // Read data from local/session storage during component mount
        const data = sessionStorage.getItem('userProfile');
        if (data) {
            setUserProfile(JSON.parse(data));
        }
    }, []);

    return (
        <Context.Provider value={{ userProfile, setUserProfile }}>
            {children}
        </Context.Provider>
    );
};