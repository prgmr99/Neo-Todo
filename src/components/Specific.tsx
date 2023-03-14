import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const Wrapper = styled(motion.div)``;
const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Specific() {
  return (
    <Wrapper>
      <AnimatePresence>
        <Overlay></Overlay>
      </AnimatePresence>
    </Wrapper>
  );
}

export default Specific;
