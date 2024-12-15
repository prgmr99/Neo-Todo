import styled from "styled-components";

const STitleWrapper = styled.section`
  width: 72%;
  height: 92px;
  display: flex;
  padding-left: 20px;
  background-color: ${(props) => props.theme.headerColor};
  box-shadow: 6px 6px 12px ${(props) => props.theme.boxShadowColor};
`;

const STitle = styled.h1`
  font-size: 75px;
  color: ${(props) => props.theme.textColor};
`;

const Title = () => {
  return (
    <STitleWrapper>
      <STitle>Trello</STitle>
    </STitleWrapper>
  );
};

export default Title;
