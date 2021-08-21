import React from "react";
import styled from "@emotion/styled";
import SwitchMenu from "./SwitchMenu";
import RosterContext from "../context/RosterContext";
type DropdownProps = {
  visible: boolean;
};

const Container = styled("div")`
  display: flex;
  height: 50px;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #ffebd6;
  position: relative;
  z-index: 2000;
`;

const InvisibleClickBox = styled("div")`
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 0;
`;

const ClusterNameControlContainer = styled("div")`
  display: flex;
  height: 100%;
  width: 200px;
  position: relative;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const ClusterName = styled("input")`
  height: 100%;
  width: 100%;
  font-size: 26px;
  background-color: inherit;
  border: none;
  box-shadow: none;
  outline: none;
`;

const Dropdown = styled("div")<DropdownProps>`
  position: absolute;
  top: 95%;
  width: 100%;
  background-color: #ffebd6;
  z-index: 100;
  animation: ${({ visible }) => (visible ? "on 1s both" : "")};
  overflow: auto;

  @keyframes on {
    0% {
      max-height: 0;
    }
    ,
    100% {
      max-height: 300px;
    }
  }
`;

const Item = styled("div")`
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%;
`;

const Header = () => {
  const contextData = React.useContext(RosterContext);
  const [currentCluster, setCurrentCluster] = React.useState("Pacu24 UHZ");
  const [input, setInput] = React.useState("Pacu24 UHZ");
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const ref = React.useRef<any>();
  const ref2 = React.useRef<any>();
  const rosterList =
    currentCluster !== input
      ? contextData?.map((clusterName) =>
          clusterName.cluster.toLowerCase().includes(input.toLowerCase())
            ? clusterName.cluster
            : ""
        )
      : contextData?.map((clusterName) => clusterName.cluster);

  const clusters = rosterList?.filter((cluster) => cluster);

  const activateDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const forceCloseDropdown = (event: any) => {
    const target = event.target;
    (target !== ref && dropdownVisible) || (target !== ref2 && dropdownVisible)
      ? setDropdownVisible(false)
      : "";
  };

  const changeCluster = (clusterName: string) => {
    setCurrentCluster(clusterName);
    setInput(clusterName);
    setDropdownVisible(false);
  };

  const changeInputHandler = (event: any) => {
    setInput(event.target.value);
  };

  return (
    <>
      {dropdownVisible ? (
        <InvisibleClickBox onClick={forceCloseDropdown} />
      ) : (
        ""
      )}
      <Container>
        <ClusterNameControlContainer ref={ref}>
          <ClusterName
            value={input}
            onChange={changeInputHandler}
            onClick={activateDropdown}
            ref={ref2}
          />
          {dropdownVisible ? (
            <Dropdown visible={dropdownVisible}>
              {clusters?.map((item, index) => {
                return (
                  <Item
                    key={`${item}${index}`}
                    onClick={() => changeCluster(item)}
                  >
                    {item}
                  </Item>
                );
              })}
            </Dropdown>
          ) : (
            ""
          )}
        </ClusterNameControlContainer>
      </Container>
      <SwitchMenu />
    </>
  );
};

export default Header;
