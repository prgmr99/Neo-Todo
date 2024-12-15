import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { isDarkAtom } from "../../atoms";

const STitleWrapper = styled.section`
  width: 72%;
  height: 92px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.headerColor};
  box-shadow: 6px 6px 12px ${(props) => props.theme.boxShadowColor};
`;

const STitle = styled.h1`
  font-size: 60px;
  font-weight: 500;
  margin-bottom: 2px;
  color: ${(props) => props.theme.textColor};
`;

const Title = () => {
  const isDarkMode = useRecoilValue(isDarkAtom);
  const title = isDarkMode ? "How was your day?" : "Have a good day!";

  return (
    <STitleWrapper>
      <STitle>{title}</STitle>
    </STitleWrapper>
  );
};

export default Title;
