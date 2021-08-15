import { h } from "preact";
import { useEffect, useCallback, useRef } from "preact/hooks";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  background: #1f1f1f;
  position: fixed;
  left: ${(props) => props.x || 0}px;
  top: ${(props) => props.y || 0}px;
  border-radius: 10px;
  padding: ${(props) => props.pd ?? 20}px;
  z-index: 4;

  ${(props) => `
    transform: translate(
      ${props.transform.x ? -100 : 0}%, 
      ${props.transform.y ? -100 : 0}%);
  `}
`;

export const Tooltip = ({
  x,
  y,
  removeFn = () => {},
  pd,
  forceTranslate = { x: false, y: false },
  children,
}) => {
  let tooltipRef = useRef();

  const handleClick = useCallback(
    (e) => {
      if (
        // Clicking on target
        tooltipRef.current !== e.target &&
        // Clicking on element in target
        !tooltipRef.current.contains(e.target) &&
        // Clicking on element with class "listener-ignore"
        e.target.className.baseVal !== "listener-ignore"
      )
        removeFn();
    },
    [removeFn]
  );

  useEffect(() => {
    window.addEventListener("scroll", removeFn);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("scroll", removeFn);
      window.removeEventListener("click", handleClick);
    };
  }, [handleClick, removeFn]);

  return (
    <Wrapper
      x={x}
      y={y}
      pd={pd}
      transform={{
        x: forceTranslate.x || x > window.screen.availWidth / 2,
        y: forceTranslate.y || y > window.screen.availHeight / 2,
      }}
      ref={tooltipRef}
    >
      {children}
    </Wrapper>
  );
};
