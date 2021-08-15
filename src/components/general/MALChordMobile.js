import { h } from "preact";
import styled from "styled-components";

import MALChordLogo from "../../assets/branding/mal-chord-small.svg";
import MALAcronym from "../../assets/branding/mal.svg";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding-right: 20px;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 50px;
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

const Logo = styled.div`
  background-color: #2e51a2;
  width: 8em;
  height: 8em;
  min-width: 8em;
  min-height: 8em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  border-radius: 15px;
  cursor: ${(props) => (props.isLink ? "pointer" : "auto")};

  &:hover {
    & img {
      transform: scale(1.1);
    }
  }
`;

const MALChordLogoImg = styled.img`
  width: 6rem;
  transform: scale(1);
  transition: transform 50ms linear;
`;

const MALTextImg = styled.img`
  height: 5rem;
`;

export const MALChordMobile = ({ isLink, logout }) => {
  return (
    <Wrapper>
      <div style={{ display: "flex", marginBottom: "15px" }}>
        <Logo
          className="hlp-1"
          onClick={logout}
          role={isLink && "button"}
          isLink={isLink}
        >
          <MALChordLogoImg src={MALChordLogo} />
        </Logo>
        <TextWrap>
          <Line fs={1.8}>graph your</Line>
          <div style={{ display: "flex", alignContent: "center" }}>
            <MALTextImg src={MALAcronym} />
          </div>
        </TextWrap>
      </div>
      <Line fs={1.2} fw={300}>
        Explore an interactive chord diagram of your MyAnimeList library 📈
      </Line>
    </Wrapper>
  );
};
