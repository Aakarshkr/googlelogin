import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";



console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);

const backendUrl = process.env.REACT_APP_BACKEND_URL;



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isSignup
      ? "http://localhost:5000/api/users/register"
      : "http://localhost:5000/api/users/login";

    const body = isSignup
      ? { username, email, phoneNumber, password }
      : { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        alert(isSignup ? "Signup successful!" : "Login successful!");
        if (!isSignup) navigate("/home");
        
      } else {
        setErrorMessage(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setErrorMessage("");
    setEmail("");
    setPassword("");
    setUsername("");
    setPhoneNumber("");
  };

  const handleForgotPassword = () => {
    navigate("/forgotPassword");
  };

  return (
    <div className="loginpage">
      <h2>{isSignup ? "Signup" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        {isSignup && (
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? "Signup" : "Login"}</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {!isSignup && (
        <p>
          Forgot your password?{' '}
          <span className="link" onClick={handleForgotPassword}>

            Reset it here.
          </span>
        </p>
      )}
      <p className="link"  style={{ cursor: 'pointer' }} onClick={toggleMode}>
        {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
      </p>
    </div>
  );
};

export default Login;
