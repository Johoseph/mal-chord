import { h } from "preact";
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
        <Button onClick={() => setHelpRequired(false)}>
          I&apos;m all good
        </Button>
        <Button onClick={progressHelp}>Let&apos;s go!</Button>
      </>
    );
  }

  if (isLast) {
    return (
      <Button icon={true} onClick={() => setHelpRequired(false)}>
        <BsCheck viewBox="0 -2 16 18" />
      </Button>
    );
  }

  return (
    <>
      <Button icon={true} onClick={() => setHelpRequired(false)}>
        <BsX />
      </Button>
      <Button icon={true} onClick={progressHelp}>
        <BsArrowRightShort />
      </Button>
    </>
  );
};

export const Help = ({ helpIndex, progressHelp, setHelpRequired }) => {
  const content = helpContent[helpIndex - 1];
  const isLast = helpIndex === helpContent.length;

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
      <Controls>
        {getControls(helpIndex, isLast, progressHelp, setHelpRequired)}
      </Controls>
    </Wrapper>
  );
};
