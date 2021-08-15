import { h } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";
import styled from "styled-components";
import helpContent from "./helpContent.json";

import { BsArrowRightShort, BsCheck, BsX } from "react-icons/bs";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  font-size: ${(props) => props.fs ?? 1.5}rem;
  margin-bottom: 15px;
  white-space: nowrap;
`;

const Body = styled.div`
  font-size: 1rem;
  margin-bottom: 20px;
  max-width: 300px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: ${(props) => props.jc ?? "flex-end"};
`;

const Button = styled.button`
  border-radius: 9999px;
  border: none;
  background: #2e51a2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;

  ${(props) =>
    props.icon
      ? `
    width: 2rem;
    height: 2rem;
    font-size: 1.3rem;
  `
      : `
    padding: 10px 15px;
  `}

  &:last-of-type {
    margin-left: 10px;
  }

  &:hover,
  :focus-visible {
    background: #2a4890;
  }
`;

const P = styled.p`
  margin: 0;
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }

  ${(props) =>
    props.fw &&
    `
    font-weight: ${props.fw};
  `}
`;

const getControls = (index, isLast, progressHelp, setHelpRequired) => {
  if (index === 1) {
    return (
      <>
        <Button onClick={() => setHelpRequired(false)} aria-label="Exit help">
          I&apos;m all good
        </Button>
        <Button onClick={progressHelp} aria-label="Begin help">
          Let&apos;s go!
        </Button>
      </>
    );
  }

  if (isLast) {
    return (
      <Button
        icon={true}
        onClick={() => setHelpRequired(false)}
        aria-label="Exit help"
      >
        <BsCheck viewBox="0 -2 16 18" />
      </Button>
    );
  }

  return (
    <>
      <Button
        icon={true}
        onClick={() => setHelpRequired(false)}
        aria-label="Quit help"
      >
        <BsX />
      </Button>
      <Button
        icon={true}
        onClick={progressHelp}
        aria-label="Progress to next help item"
      >
        <BsArrowRightShort />
      </Button>
    </>
  );
};

export const Help = ({ helpIndex, progressHelp, setHelpRequired }) => {
  const content = helpContent[helpIndex - 1];
  const isLast = helpIndex === helpContent.length;

  let controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.querySelector("button")?.focus();
    }
  }, []);

  const focusoutListener = useCallback(
    (e) => {
      if (
        !(
          controlsRef.current?.contains(e.relatedTarget) ||
          document.querySelector(`.hlp-${helpIndex}`).contains(e.relatedTarget)
        )
      ) {
        controlsRef.current.querySelector("button")?.focus();
      }
    },
    [helpIndex]
  );

  useEffect(() => {
    window.addEventListener("focusout", focusoutListener);
    return () => window.removeEventListener("focusout", focusoutListener);
  }, [focusoutListener]);

  return (
    <Wrapper>
      <Header>{content.header}</Header>
      <Body>
        {content.body.map((paragraph, i) => (
          <P key={i} fw={i > 0 && 300}>
            {paragraph}
          </P>
        ))}
      </Body>
      <Controls ref={controlsRef}>
        {getControls(helpIndex, isLast, progressHelp, setHelpRequired)}
      </Controls>
    </Wrapper>
  );
};
