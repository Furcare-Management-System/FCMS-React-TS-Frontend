import { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext({
  user: null,
  staffuser: null,
  petowner: null,
  token: null,
  notification: null,
  setUser: () => {},
  setStaffuser: () => {},
  setPetowner: () => {},
  setToken: () => {},
  setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
  const [notification, _setNotification] = useState("");
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [user, setUser] = useState({
    id: localStorage.getItem("User_id"),
    email: localStorage.getItem("email"),
    role_id: localStorage.getItem("Role"),
  });
  const [staffuser, setStaffuser] = useState({
    id: localStorage.getItem("id"),
    firstname: localStorage.getItem("firstname"),
    lastname: localStorage.getItem("lastname"),
  });

  const [petowner, setPetowner] = useState({
    id: localStorage.getItem("id"),
    firstname: localStorage.getItem("firstname"),
    lastname: localStorage.getItem("lastname"),
  });

  const setNotification = (message) => {
    _setNotification(message);
    setTimeout(() => {
      _setNotification("");
    }, 6000);
  };

  useEffect(() => {
    if (user.id && user.email) {
      localStorage.setItem("User_id", user.id);
      localStorage.setItem("email", user.email);
      localStorage.setItem("Role", user.role_id);
      if (user.role_id === 2) {
        localStorage.setItem("id", staffuser.id);
        localStorage.setItem("firstname", staffuser.firstname);
        localStorage.setItem("lastname", staffuser.lastname);
      } else if (user.role_id === 3) {
        localStorage.setItem("id", petowner.id);
        localStorage.setItem("firstname", petowner.firstname);
        localStorage.setItem("lastname", petowner.lastname);
      }
    } else {
      localStorage.removeItem("User_id");
      localStorage.removeItem("email");
      localStorage.removeItem("Role");
      localStorage.removeItem("id");
      localStorage.removeItem("firstname");
      localStorage.removeItem("lastname");
    }
  }, [user, staffuser, petowner]);

  const updateUser = (newUser) => {
    setUser(newUser);
  };
  const updateStaff = (newStaffuser) => {
    setStaffuser(newStaffuser);
  };
  const updatePetowner = (newPetowner) => {
    setPetowner(newPetowner);
  };

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  return (
    <StateContext.Provider
      value={{
        token,
        setToken,
        notification,
        setNotification,
        user,
        updateUser,
        staffuser,
        updateStaff,
        petowner,
        updatePetowner,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
