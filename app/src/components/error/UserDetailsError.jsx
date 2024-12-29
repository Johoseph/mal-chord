import styled from "styled-components";

import { BsArrowClockwise } from "react-icons/bs";

const Wrapper = styled.div`
  display: flex;
`;

const Button = styled.button`
  background: #2e51a2;
  border: none;
  outline: none;
  font-weight: bold;
  font-size: 1rem;
  padding: 10px;
  min-height: 40px;
  min-width: 40px;
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
  font-size: 1.4rem;

  transform: rotate(0deg);
  transition: transform 200ms linear;
`;

const Flex = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 15px;
`;

const Text = styled.span`
  margin-top: 5px;
  font-weight: 300;
  font-size: 0.9rem;
`;

export const UserDetailsError = ({ refetch }) => {
  return (
    <Wrapper>
      <Flex>
        Something went wrong. <Text>Try reloading.</Text>
      </Flex>
      <Button onClick={refetch}>
        <Icon />
      </Button>
    </Wrapper>
  );
};
