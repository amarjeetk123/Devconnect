import { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const register = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", data);
      localStorage.setItem("token", res.data.token);
      window.location = "/dashboard";
    } catch {
      alert("Register failed");
    }
  };

  return (
    <div className="login-page container">
      <div className="card">
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button className="login-btn" onClick={register}>Register</button>
      </div>
    </div>
  );
}