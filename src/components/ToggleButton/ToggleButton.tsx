import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { isDarkAtom } from "../../atoms";

const SToggleButton = styled.button`
  font-size: 30px;
  position: absolute;
  top: 3vh;
  left: 93vw;
  background-color: transparent;
  border: none;
`;

const ToggleButton = () => {
  const [isDarkMode, setDarkAtom] = useRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  return (
    <SToggleButton onClick={toggleDarkAtom}>
      {isDarkMode ? "🌙" : "☀️"}
    </SToggleButton>
  );
};

export default ToggleButton;
