import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import LoginForm from "./components/LoginForm.jsx";
import { MyContext } from "./MyContext.jsx";
import { useEffect, useState } from "react";
import { v1 as uuidv1} from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); 
  const [newChat, setNewChat] = useState(true);   
  const [allThreads, setAllThreads] = useState([]);

  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("stackmind_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("stackmind_token") || "");

  const [showAuthModal, setShowAuthModal] = useState(false);

  /* authMode IS DECIDE THE FORM IS LOGIN/SIGN UP */
  const [authMode, setAuthMode] = useState("Login"); 

  useEffect(() => {
    if (user) {
      localStorage.setItem("stackmind_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("stackmind_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("stackmind_token", token);
    } else {
      localStorage.removeItem("stackmind_token");
    }
  }, [token]);

  const loginUser = (loggedInUser, authToken) => {
    setUser(loggedInUser);
    setToken(authToken);
    setShowAuthModal(false);
    setAuthMode("Login");
  };

  const logoutUser = () => {
    setUser(null);
    setToken("");
    setShowAuthModal(false);
    setAuthMode("Login");
  };

  // passing values
  const provideValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId, 
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    user, token,
    showAuthModal, setShowAuthModal,
    authMode, setAuthMode,
    loginUser, logoutUser,
  }; 

  return (
    <div className="app">
      <MyContext.Provider value={provideValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
        {showAuthModal && <LoginForm />}
      </MyContext.Provider>
    </div>
  );
}

export default App;