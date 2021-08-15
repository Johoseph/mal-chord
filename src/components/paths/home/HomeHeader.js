import { h } from "preact";
import styled from "styled-components";

import MALLogo from "../../../assets/branding/mal.svg";
import { MALChord } from "../../general/MALChord";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 12em;
  width: 75%;
  margin: 50px auto;

  @media (max-width: 1000px) {
    width: 95%;
  }
`;

const Button = styled.button`
  background: #2e51a2;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 15px 20px;
  margin-top: 20px;
  min-height: 55px;
  min-width: 80px;
  border-radius: 9999px;
  cursor: pointer;

  display: flex;
  align-items: center;

  & span {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &:hover,
  :focus-visible {
    background: #2a4890;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MALLogoImg = styled.img`
  margin-left: 6px;
  height: 1.4rem;
`;

export const HomeHeader = ({ setLoginType }) => {
  return (
    <Wrapper>
      <MALChord />
      <Flex>
        <Button onClick={() => setLoginType("user")}>
          Login with <MALLogoImg src={MALLogo} />
        </Button>
        <Button onClick={() => setLoginType("guest")}>
          <span>Try as a Guest</span>
        </Button>
      </Flex>
    </Wrapper>
  );
};
