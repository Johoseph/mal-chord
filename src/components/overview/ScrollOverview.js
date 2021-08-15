import { h } from "preact";
import { useEffect, useState, useCallback, useRef } from "preact/hooks";
import styled, { keyframes } from "styled-components";

import MALChord from "../../assets/branding/mal-chord-small.svg";
import MALLogo from "../../assets/branding/mal.svg";
import { UserDetails } from "./UserDetails";

const slide = keyframes`
  from {
    top: calc(-3rem - 20px);
  }
  to {
    top: 0;
  }
`;
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #1f1f1f;
  z-index: 1;
  border-bottom: 1px solid #444444;

  animation: ${slide} 200ms linear;
  transition: top 200ms linear;
`;

const Flex = styled.div`
  display: flex;
`;

const Overview = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
`;

const Logo = styled.div`
  background-color: #2e51a2;
  width: 3em;
  height: 3em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

const MALLogoImg = styled.img`
  height: 2.8rem;
  position: relative;
  top: 4px;
  margin-right: 15px;
`;

export const ScrollOverview = ({ useMock }) => {
  let overviewRef = useRef();

  const [isVisible, setIsVisible] = useState(window.scrollY > 190);

  const scrollListener = useCallback(() => {
    if (window.scrollY > 190) {
      setIsVisible(true);
      return;
    }

    if (window.scrollY <= 190 && isVisible) {
      if (overviewRef.current)
        overviewRef.current.style.top = "calc(-3rem - 20px)";
      setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }
  }, [isVisible]);

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, [scrollListener]);

  if (isVisible)
    return (
      <Wrapper ref={overviewRef}>
        <Overview>
          <Flex>
            <MALLogoImg src={MALLogo} alt="MAL Logo" />
            <Logo>
              <img
                src={MALChord}
                alt="MAL Chord Logo"
                style={{ padding: "3px" }}
              />
            </Logo>
          </Flex>
          <UserDetails compressed={true} useMock={useMock} />
        </Overview>
      </Wrapper>
    );
};
