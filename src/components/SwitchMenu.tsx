import React from "react";
import styled from "@emotion/styled";
import listImage from "../assets/img/list.svg";
import calendarImage from "../assets/img/calendar.svg";

type SwitchButtonProps = {
  shadow: string;
  pressedButton: string | null;
  initial: boolean;
};

const SwitchContainer = styled("div")`
  display: flex;
  background-color: #ffebd6;
  width: 100%;
  height: 45px;
  border-radius: 0 0 25px 25px;
  box-shadow: 0px 5px 9px rgba(213, 210, 208, 0.59),
    inset 4px 5px 15px rgba(255, 255, 255, 0.34),
    inset 0px -2px 8px rgba(213, 210, 208, 0.5);
`;

const LeftSwitch = styled("div")<SwitchButtonProps>`
  display: flex;
  justify-content: center;
  allign-items: center;
  width: 50%;
  height: 40px;
  margin: 0 0 5px 5px;
  background-color: ${({ pressedButton }) =>
    pressedButton === "left" ? "#ffdebd" : "#ffebd6"};
  border-radius: 0 0 0 25px;
  box-shadow: ${({ shadow, pressedButton }) =>
    pressedButton === "left" ? shadow : "none"};

  animation: ${({ pressedButton, initial }) =>
    pressedButton === "left"
      ? "in 0.2s cubic-bezier(.5,.5,0,1.25) both"
      : !initial
      ? "out 0.2s cubic-bezier(.5,.5,0,1.25) 0.1s both"
      : ""};

  @keyframes in {
    0% {
      box-shadow: none;
    }
    100% {
      box-shadow: 0.5px 0px 0.3px rgba(255, 255, 255, 0.78),
        -0.5px 0px 0.5px rgba(0, 0, 0, 0.25),
        inset 0px 1px 2px rgba(0, 0, 0, 0.25);
    }
  }
  @keyframes out {
    0% {
      background-color: #ffdebd;
      box-shadow: 0.5px 0px 0.3px rgba(255, 255, 255, 0.78),
        -0.5px 0px 0.5px rgba(0, 0, 0, 0.25),
        inset 0px 1px 2px rgba(0, 0, 0, 0.25);
    }
    90 {
      box-shadow: none;
    }
    100% {
      background-color: "#ffebd6";
      box-shadow: none;
    }
  } ;
`;

const RightSwitch = styled("div")<SwitchButtonProps>`
  display: flex;
  justify-content: center;
  allign-items: center;
  width: 50%;
  height: 40px;
  margin: 0 5px 5px 0;
  border-radius: 0 0 25px 0;
  background-color: ${({ pressedButton }) =>
    pressedButton === "right" ? "#ffdebd" : "#ffebd6"};
  box-shadow: ${({ shadow, pressedButton }) =>
    pressedButton === "right" ? shadow : ""};

  animation: ${({ pressedButton, initial }) =>
    pressedButton === "right"
      ? "in 0.2s cubic-bezier(.5,.5,0,1.25) both"
      : !initial
      ? "out 0.2s cubic-bezier(.5,.5,0,1.25) 0.1s both"
      : ""};
`;

const SwitchMenu = () => {
  const [pressedButton, setPressedButton] = React.useState<string | null>(null);
  const [initial, setInitial] = React.useState(true);

  React.useEffect(() => {
    const timeOut: any = () => setTimeout(() => setInitial(false), 1000);
    if (pressedButton === null) {
      timeOut();
    }

    return () => clearTimeout(timeOut);
  }, [pressedButton]);

  const handleClick = (direction: string) => {
    setPressedButton(direction);
  };
  const shadow = `0.5px 0px 0.3px rgba(255, 255, 255, 0.78),
      -0.5px 0px 0.5px rgba(0, 0, 0, 0.25), inset 0px 1px 2px rgba(0, 0, 0, 0.25)`;
  return (
    <>
      <SwitchContainer>
        <LeftSwitch
          onClick={() => {
            handleClick("left");
          }}
          pressedButton={pressedButton}
          shadow={shadow}
          initial={initial}
        >
          <img src={calendarImage} />
        </LeftSwitch>
        <RightSwitch
          onClick={() => {
            handleClick("right");
          }}
          pressedButton={pressedButton}
          shadow={shadow}
          initial={initial}
        >
          <img src={listImage} />
        </RightSwitch>
      </SwitchContainer>
    </>
  );
};

export default SwitchMenu;
