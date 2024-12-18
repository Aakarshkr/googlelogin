import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RequestPassword.scss'

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
const navigate =useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/users/reset-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      // Check if the response is valid and the status is OK
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
  
      // Ensure that the response body is not empty
      const data = await response.json();
      setMessage(data.message);
  
      if (data.success) {
        // Redirect to login page after email is sent
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setMessage("An error occurred while sending the reset link.");
    }
  };
  
  return (
    <div className="forgot" >
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RequestPasswordReset;
