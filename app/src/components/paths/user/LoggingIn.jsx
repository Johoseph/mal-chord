import styled from "styled-components";
import { useContext } from "preact/hooks";

import { UserContext } from "contexts";
import { Spinner, GraphError } from "components";

const Wrapper = styled.div`
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
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
      <Spinner />
    </Wrapper>
  );
};
