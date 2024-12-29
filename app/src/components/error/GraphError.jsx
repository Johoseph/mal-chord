import styled from "styled-components";

import { BsArrowClockwise } from "react-icons/bs";

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background: #2e51a2;
  border: none;
  outline: none;
  font-weight: bold;
  font-size: 1rem;
  padding: 15px 20px;
  margin-top: 20px;
  min-height: 40px;
  min-width: 80px;
  border-radius: 9999px;
  cursor: pointer;

  display: flex;
  align-items: center;

  &:hover,
  :focus-visible {
    background: #2a4890;

    & svg {
      transform: rotate(270deg);
    }
  }
`;

const Icon = styled(BsArrowClockwise)`
  margin-right: 10px;
  font-size: 1.4rem;

  transform: rotate(0deg);
  transition: transform 200ms linear;
`;

export const GraphError = ({ refetch }) => {
  return (
    <Wrapper>
      <span>
        Something went wrong.{" "}
        <span style={{ fontWeight: "300" }}>Try reloading.</span>
      </span>
      <Button onClick={refetch}>
        <Icon />
        Retry
      </Button>
    </Wrapper>
  );
};
