import { h } from "preact";
import styled from "styled-components";

import MALLogoText from "../../assets/branding/mal-text.svg";
import MALChordLogo from "../../assets/branding/mal-chord-small.svg";
import { useContext } from "preact/hooks";
import { UserContext } from "../../contexts";

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
  cursor: ${(props) => (props.isLink ? "pointer" : "auto")};

  &:hover {
    & img {
      transform: scale(1.1);
    }
  }
`;

const MALChordLogoImg = styled.img`
  width: 9rem;
  transform: scale(1);
  transition: transform 50ms linear;
`;

export const MALChord = ({ isLink = false }) => {
  const { setLoginType } = useContext(UserContext);

  const logout = () => {
    if (isLink) setLoginType("home");
  };

  return (
    <div style={{ display: "flex" }}>
      <Logo
        className="hlp-1"
        onClick={logout}
        role={isLink && "button"}
        isLink={isLink}
      >
        <MALChordLogoImg src={MALChordLogo} />
      </Logo>
      <TextWrap>
        <Line fs={2}>graph your</Line>
        <div style={{ display: "flex", alignContent: "center" }}>
          <img src={MALLogoText} style={{ height: "5.5rem" }} />
        </div>
        <Line fs={1.2} fw={300}>
          Explore an interactive chord diagram of your MyAnimeList library 📈
        </Line>
      </TextWrap>
    </div>
  );
};
