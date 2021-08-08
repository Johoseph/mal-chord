import { h } from "preact";
import styled from "styled-components";

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
`;

const helpContent = [
  {
    header: "Welcome to MAL Chord 📈",
    body: [
      "MAL Chord is an interactive chord diagram that allows you to view your anime history in a unique way.",
      "Would you like a tour of the app?",
    ],
  },
  {
    header: "So who are you?",
    body: ["User Details"],
  },
  {
    header: "Readability first",
    body: ["Old filter"],
  },
  {
    header: "Everyone makes mistakes",
    body: ["Undo/Redo"],
  },
  {
    header: "Time to categorise",
    body: ["End Category"],
  },
  {
    header: "Keep it in order",
    body: ["Start/End Sort"],
  },
  {
    header: "What am I looking at?",
    body: ["Node Left Click"],
  },
  {
    header: "Hide and Highlight 🙉 🙈",
    body: ["Node Right Click"],
  },
  {
    header: "...and that's all folks!",
    body: ["Help"],
  },
];

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

export const HelpContent = ({ helpIndex, progressHelp, setHelpRequired }) => {
  const content = helpContent[helpIndex - 1];
  const isLast = helpIndex === helpContent.length;

  return (
    <Wrapper>
      <Header>{content.header}</Header>
      <Body>
        {content.body.map((paragraph, i) => (
          <P key={i}>{paragraph}</P>
        ))}
      </Body>
      <Controls>
        {getControls(helpIndex, isLast, progressHelp, setHelpRequired)}
      </Controls>
    </Wrapper>
  );
};
