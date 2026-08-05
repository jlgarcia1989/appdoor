// AuthContext.js
import React, {createContext, useContext, useRef, useState} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('Usuario');
  const drawer = useRef(null);

  const openDrawer = () => {
    drawer.current?.openDrawer();
  };

  const closeDrawer = () => {
    drawer.current?.closeDrawer();
  };
  const [user, setUser] = useState({
    phoneNumber: '',
    name:'',
    direccion:'',
    activo:null,
    numeroIdentificacion:'',
    fechaNacimiento:'',
    idTipoUsuario:'',
    correo:'',
    city:''
  });

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateUser = user => {
    setUser({...user});
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        drawer,
        openDrawer,
        login,
        logout,
        updateUser,
        closeDrawer,
        userType,
        setUserType
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
