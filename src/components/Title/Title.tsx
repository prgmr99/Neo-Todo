import React from "react";
import styled from "styled-components";

const STitle = styled.h1`
  font-size: 75px;
  text-align: left;
  margin-left: 25vh;
  margin-top: 5vh;
  height: 85px;
  width: 100%;
  color: ${(props) => props.theme.textColor};
  padding-left: 20px;
  background-color: ${(props) => props.theme.headerColor};
  box-shadow: 4px 4px 8px ${(props) => props.theme.boxShadowColor};
`;

const Title = () => {
  return <STitle>Trello</STitle>;
};

export default Title;
