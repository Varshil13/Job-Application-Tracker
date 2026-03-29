import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUser = async () => {
    try {
        
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/getme`, {
        credentials: "include",
      });

      const data = await res.json();
      setAuthUser(data.user);
    } catch (err) {
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, []);


  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
