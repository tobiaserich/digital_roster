import React from "react";
import { SinglePersonRoster } from "../assets/getRoster";

const RosterContext = React.createContext<
  { cluster: string; employees: SinglePersonRoster[] }[] | null
>(null);

export default RosterContext;
