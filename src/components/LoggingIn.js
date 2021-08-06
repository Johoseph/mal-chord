import { h } from "preact";
import styled from "styled-components";
import { SankeyLoading } from "./graph/loading/SankeyLoading";

const Wrapper = styled.div`
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
`;

const LoggingIn = () => {
  return (
    <Wrapper>
      <SankeyLoading hght={75} />
    </Wrapper>
  );
};

export default LoggingIn;
