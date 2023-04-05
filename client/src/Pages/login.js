import React, { useState } from "react";
// import "./App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:1337/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);

    if (data.user) {
      localStorage.setItem("token", data.user);
      alert("Login Successful!!!");
      window.location.href = "/dashboard";
    } else {
      alert("Incorrect username/Password");
    }
  };
  return (
    <div className="App">
      <h1>Login</h1>
      <br />
      <form onSubmit={loginUser}>
        <br />
        <input
          value={email}
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          value={password}
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
