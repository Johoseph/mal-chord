import { h } from "preact";
import styled from "styled-components";

import MALLogoText from "../../../assets/branding/mal-text.svg";
import MALChord from "../../../assets/branding/mal-chord-small.svg";
import MALLogo from "../../../assets/branding/mal.svg";

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

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Line = styled.span`
  display: flex;
  white-space: pre-wrap;
  font-size: ${(props) => (props.fs ? props.fs : 1)}rem;
  ${(props) =>
    props.fw &&
    `
    font-weight: ${props.fw};
  `}
`;

const LineTwo = styled.span`
  display: flex;
  align-content: center;
`;

const Logo = styled.div`
  background-color: #2e51a2;
  width: 12em;
  height: 12em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  border-radius: 15px;
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

  &:hover,
  :focus-visible {
    background: #2a4890;
  }
`;

export const HomeHeader = ({ setLoginType }) => {
  return (
    <Wrapper>
      <div style={{ display: "flex" }}>
        <Logo>
          <img src={MALChord} style={{ width: "9rem" }} />
        </Logo>
        <TextWrap>
          <Line fs={2}>graph your</Line>
          <LineTwo>
            <img src={MALLogoText} style={{ height: "5.5rem" }} />
          </LineTwo>
          <Line fs={1.2} fw={300}>
            Explore an interactive chord diagram of your MyAnimeList library 📈
          </Line>
        </TextWrap>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Button onClick={() => setLoginType("user")}>
          Login with{" "}
          <img
            src={MALLogo}
            style={{
              marginLeft: "6px",
              height: "1.4rem",
            }}
          />
        </Button>
        <Button onClick={() => setLoginType("guest")}>
          <span
            style={{ display: "flex", width: "100%", justifyContent: "center" }}
          >
            Try as a Guest
          </span>
        </Button>
      </div>
    </Wrapper>
  );
};
