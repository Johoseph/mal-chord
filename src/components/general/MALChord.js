import { h } from "preact";
import styled from "styled-components";

import MALLogoText from "../../assets/branding/mal-text.svg";
import MALChordLogo from "../../assets/branding/mal-chord-small.svg";
import MALAcronym from "../../assets/branding/mal.svg";
import { useContext, useEffect, useState } from "preact/hooks";
import { UserContext } from "../../contexts";
import { useWindowDimensions } from "../../hooks";
import { MALChordMobile } from "./MALChordMobile";

const ACRONYM_WIDTH = 1200;

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
  width: 12em;
  height: 12em;
  min-width: 12em;
  min-height: 12em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  border-radius: 15px;
  cursor: ${(props) => (props.isLink ? "pointer" : "auto")};
  outline: none;

  &:hover,
  :focus-visible {
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

const MALTextImg = styled.img`
  height: ${(props) => (props.useAcronym ? "4.5" : "5.5")}rem;

  @media (max-width: 940px) {
    height: 3.5rem;
  }
`;

export const MALChord = ({ isLink = false }) => {
  const { windowWidth } = useWindowDimensions();
  const [useAcronym, setUseAcronym] = useState(windowWidth < ACRONYM_WIDTH);

  const { setLoginType, mobileWidth } = useContext(UserContext);

  const logout = () => {
    if (isLink) setLoginType("home");
  };

  useEffect(() => {
    if (windowWidth) {
      setUseAcronym(windowWidth < ACRONYM_WIDTH);
    }
  }, [windowWidth]);

  if (windowWidth < mobileWidth) {
    return <MALChordMobile logout={logout} />;
  }

  return (
    <div style={{ display: "flex" }}>
      <Logo
        className="hlp-1"
        onClick={logout}
        role={isLink && "button"}
        isLink={isLink}
        aria-label={isLink ? "Return home" : undefined}
        tabIndex={isLink ? "0" : undefined}
      >
        <MALChordLogoImg src={MALChordLogo} role="presentation" />
      </Logo>
      <TextWrap>
        <Line fs={2}>graph your</Line>
        <div style={{ display: "flex", alignContent: "center" }}>
          <MALTextImg
            src={useAcronym ? MALAcronym : MALLogoText}
            useAcronym={useAcronym}
            alt="MyAnimeList"
          />
        </div>
        <Line fs={1.2} fw={300}>
          Explore an interactive chord diagram of your MyAnimeList library 📈
        </Line>
      </TextWrap>
    </div>
  );
};
