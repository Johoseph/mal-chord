import styled from "styled-components";
import { default as CountComp } from "react-countup";

const Value = styled.span`
  font-size: 2.1rem;
  text-align: end;

  ${(props) =>
    !props.isVisible &&
    `
    display: none;
  `}
`;

const Shimmer = styled.div`
  width: 100%;
  height: 2.3rem;
  border-radius: 2.3rem;
  margin-top: 0.2rem;

  ${(props) =>
    !props.isVisible &&
    `
    display: none;
  `}
`;

export const Countup = ({ value, duration = 2.5 }) => {
  return (
    <CountComp
      start={0}
      end={value}
      delay={0}
      duration={duration}
      separator=","
      useEasing={true}
    >
      {({ countUpRef }) => (
        <>
          <Value ref={countUpRef} isVisible={!!countUpRef.current} />
          <Shimmer className="shimmer" isVisible={!countUpRef.current} />
        </>
      )}
    </CountComp>
  );
};
