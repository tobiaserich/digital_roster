import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import MainPage from "./pages/MainPage";
import getRoster from "./assets/getRoster";
import GlobalStyles from "./GlobalStyles";
import { SinglePersonRoster } from "./assets/getRoster";
import { jsx, ThemeProvider } from "@emotion/react";
import theme from "./theme/theme";
import Header from "./components/Header";
import RosterContext from "./context/RosterContext";

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

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <RosterContext.Provider value={roster ? roster : null}>
          <GlobalStyles />
          <Route>
            <Header></Header>
            <Switch></Switch>
          </Route>
        </RosterContext.Provider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
