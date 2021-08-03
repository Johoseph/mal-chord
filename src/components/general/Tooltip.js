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
  padding: 20px;
`;

export const Tooltip = ({ x, y, removeFn, children }) => {
  let tooltipRef = useRef();

  const handleClick = useCallback(
    (e) => {
      if (
        tooltipRef.current !== e.target &&
        !tooltipRef.current.contains(e.target)
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
    <Wrapper x={x} y={y} ref={tooltipRef}>
      {children}
    </Wrapper>
  );
};
