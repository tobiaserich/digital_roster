import React from "react";
import getRoster from "./assets/getRoster";
import { SinglePersonRoster } from "./assets/getRoster";

const App = (): any => {
  const [roster, setRoster] =
    React.useState<{ cluster: string; employees: SinglePersonRoster[] }[]>();

  React.useEffect(() => {
    const fetchRoster = async () => {
      const result = await getRoster();
      setRoster(result);
    };
    fetchRoster();
  }, []);

  console.log(roster);
  return <>Hello World</>;
};

export default App;
