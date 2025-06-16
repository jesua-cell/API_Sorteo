import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        //Pbtener el token del admin; para verificar
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [])

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('adminUser');
    };


    return (
        <>
            <AuthContext.Provider value={{ user, login, logout }}>
                {children}
            </AuthContext.Provider>
        </>
    )
}

export const useAuth = () => useContext(AuthContext);