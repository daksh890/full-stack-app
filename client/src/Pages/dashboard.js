import React, { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const history = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  const populateQuote = async () => {
    const req = await fetch("http://localhost:1337/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    console.log(data);
    if (data.status === "OK") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  };

  const updateQuote = async (e) => {
    e.preventDefault();

    const req = await fetch("http://localhost:1337/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ quote: tempQuote }),
    });
    const data = await req.json();
    console.log(data);
    if (data.status === "OK") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = decodeToken(token);
      console.log(user);
      if (!user) {
        localStorage.removeItem("token");
        history("/login");
      } else {
        populateQuote();
      }
    }
  }, []);

  return (
    <div>
      <h1>Your Quote: {quote || "No Quote Found."}</h1>
      <form onSubmit={updateQuote}>
        <input
          type="text"
          placeholder="Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <input type="submit" value="update quote" />
      </form>
    </div>
  );
}

export default Dashboard;
