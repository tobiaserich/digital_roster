import React from "react";
import getRoster from "./assets/getRoster";

function App() {
  const fetchRoster = async () => {
    const result = await getRoster();
  };

  fetchRoster();
  return <>Hello World</>;
}

export default App;
