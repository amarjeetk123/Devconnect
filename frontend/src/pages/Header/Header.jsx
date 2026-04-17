import { useNavigate } from "react-router-dom";
import './Header.css'

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <header className="header">
      {/* LEFT: Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        DevConnect
      </div>

      {/* RIGHT: Actions */}
      <div className="right">
        <button className="feedback-btn">Feedback</button>

        {!token ? (
          <span className="login-text" onClick={() => navigate("/login")}>
            Login
          </span>
        ) : (
          <div className="user-section">
            <div className="avatar">A</div>
            <span className="logout" onClick={handleLogout}>
              Logout
            </span>
          </div>
        )}
      </div>
    </header>
  );
}