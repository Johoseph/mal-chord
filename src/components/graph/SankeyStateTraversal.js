import { h } from "preact";
import styled from "styled-components";

import { FaUndo, FaRedo } from "react-icons/fa";
import { IoMdHelp } from "react-icons/io";
import { useCallback, useContext, useEffect } from "preact/hooks";
import { HistoryContext } from "../../contexts";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  width: 2rem;
  height: 2rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  background: #1f1f1f;
  border: none;
  outline: none;

  & svg {
    font-size: 1.1rem;
  }

  &:not(:last-of-type) {
    margin-right: 10px;
  }

  &:hover,
  :focus-visible {
    background: #252525;
  }
`;

export const SankeyStateTraversal = () => {
  const { currentIndex, setCurrentIndex, sankeyHistory } =
    useContext(HistoryContext);

  const canUndo = !(currentIndex === 0);
  const canRedo = !(currentIndex + 1 > sankeyHistory.length);

  const keyListener = useCallback(
    (e) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "z":
            if (canUndo) handleUndo();
            break;
          case "y":
            if (canRedo) handleRedo();
            break;
          default:
        }
      }
    },
    [canRedo, canUndo, handleRedo, handleUndo]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyListener);
    return () => window.removeEventListener("keydown", keyListener);
  }, [keyListener]);

  const handleUndo = useCallback(() => {
    const currentHistory = sankeyHistory[currentIndex - 1];

    currentHistory.forEach((item) => item.fn(item.undo));

    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex, sankeyHistory, setCurrentIndex]);

  const handleRedo = useCallback(() => {
    const currentHistory = sankeyHistory[currentIndex];

    currentHistory.forEach((item) => item.fn(item.redo));
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, sankeyHistory, setCurrentIndex]);

  return (
    <Wrapper>
      <Icon onClick={handleUndo} disabled={!canUndo}>
        <FaUndo viewBox="-80 -80 612 612" />
      </Icon>
      <Icon>
        <IoMdHelp />
      </Icon>
      <Icon onClick={handleRedo} disabled={!canRedo}>
        <FaRedo viewBox="-60 -80 612 612" />
      </Icon>
    </Wrapper>
  );
};
