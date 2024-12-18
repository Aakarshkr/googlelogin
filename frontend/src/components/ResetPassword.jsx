import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './ResetPassword.scss';



const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the token from URL query parameters
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/users/verify-reset-token?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setTokenValid(true);
        } else {
          setMessage(data.message || "Invalid or expired token");
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        setMessage("An error occurred while verifying the token.");
      }
    };

    if (token) {
      verifyToken();
    } else {
      setMessage("No token provided.");
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setMessage("An error occurred while resetting the password.");
    }
  };

  if (!tokenValid) {
    return <div className="reset">{message}</div>;
  }

  return (
    <div className="reset">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
