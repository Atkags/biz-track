import { useState, useEffect } from "react";

function App(){

  console.log('App rendered');
  const[message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health/").
    then((response) => response.json()).
    then((data) => {
      setMessage(data.message);
    })
    .catch(() => {
      setMessage("Could not connect to backend");
    });
  }, []);

  return(
    <div>
      <h1>
        BizTrack
      </h1>
      <p>
        {message}
      </p>
    </div>
  );
}

export default App;