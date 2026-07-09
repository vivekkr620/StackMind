import { useEffect, useState, useContext } from 'react';
import { MyContext } from '../MyContext.jsx'; 

const LoginForm = () => {
  // Yahan currState ki jagah hum context wala authMode use kar rahe hain
  const { loginUser, setShowAuthModal, authMode, setAuthMode } = useContext(MyContext); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const url = authMode === "Login" 
      ? "http://localhost:8080/api/auth/login" 
      : "http://localhost:8080/api/auth/signup";

    const bodyData = authMode === "Login" ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        loginUser(data.user, data.token);
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button type="button" onClick={() => setShowAuthModal(false)} className="close-btn">✕</button>

        <h2 className="auth-title">{authMode === "Login" ? "Log In" : "Sign Up"}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {authMode === "Sign Up" && (
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              className="auth-input"
            />
          )}
          
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="auth-input"
          />
          
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={authMode === "Login" ? "current-password" : "new-password"}
            required
            className="auth-input"
          />
          
          <button type="submit" className="auth-btn">
            {authMode === "Login" ? "Log In" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          {authMode === "Login" ? (
            <p>Don't have an account? <span className="auth-link" onClick={() => setAuthMode("Sign Up")}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span className="auth-link" onClick={() => setAuthMode("Login")}>Log In</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;