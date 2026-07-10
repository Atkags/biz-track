import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/page-styles.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/api/login/",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((response) => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("role", data.role);
      navigate("/");
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Access your POS and inventory workspace.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Username</label>
            <input
              className="field-input"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value,
                })
              }
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
          </div>

          <button className="btn btn-primary" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;