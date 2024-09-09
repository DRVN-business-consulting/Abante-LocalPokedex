import React from 'react'

const Theme = React.createContext(true)

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = React.useState(true)

    return (
        <Theme.Provider value={{ theme, setTheme }}>
            {children}
        </Theme.Provider>
    )
};

export const useTheme = () => {
    return React.useContext(Theme)
}