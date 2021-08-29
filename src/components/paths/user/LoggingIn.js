import { h } from "preact";
import { useContext } from "preact/hooks";
import styled, { keyframes } from "styled-components";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { UserContext } from "contexts";
import { GraphError } from "components";

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

export const LoggingIn = ({ loginError }) => {
  const { setLoginType } = useContext(UserContext);

  return loginError ? (
    <GraphError
      refetch={() => {
        setLoginType();
        window.location.href = localStorage.getItem("BASE_URL");
      }}
    />
  ) : (
    <Wrapper>
      <Spinner>
        <AiOutlineLoading3Quarters />
      </Spinner>
    </Wrapper>
  );
};
