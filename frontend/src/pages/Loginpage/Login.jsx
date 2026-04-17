import { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      // console.log(res , "login time data")
      window.location = "/";
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="login-page container">
      <div className="card">
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button className="login-btn" onClick={login}>Login</button>

        <p style={{marginTop:"6px"}} onClick={() => (window.location = "/register")}>
          Create Account
        </p>
      </div>
    </div>
  );
}