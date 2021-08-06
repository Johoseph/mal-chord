import { h } from "preact";
import styled, { keyframes } from "styled-components";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Wrapper = styled.div`
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  font-size: 6rem;
  color: var(--accent);
  & svg {
    animation: ${rotate} 2s linear infinite;
  }
`;

const LoggingIn = () => {
  return (
    <Wrapper>
      <Spinner>
        <AiOutlineLoading3Quarters />
      </Spinner>
    </Wrapper>
  );
};

export default LoggingIn;
