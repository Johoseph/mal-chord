import styled from "styled-components";

import { AiOutlinePrinter } from "react-icons/ai";
import { FaUndo, FaRedo } from "react-icons/fa";
import { IoMdHelp } from "react-icons/io";
import { useCallback, useEffect } from "preact/hooks";

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

export const HeaderSubControls = ({
  sankeyState,
  updateSankey,
  setIsPrinting,
  setHelpRequired,
}) => {
  const canUndo = !(sankeyState.historyIndex === 0);
  const canRedo = !(
    sankeyState.historyIndex + 1 >=
    sankeyState.sankeyHistory.length
  );

  const keyListener = useCallback(
    (e) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "z":
            if (canUndo)
              updateSankey({
                type: "undoAction",
                index: sankeyState.historyIndex,
              });
            break;
          case "y":
            if (canRedo)
              updateSankey({
                type: "redoAction",
                index: sankeyState.historyIndex,
              });
            break;
          default:
        }
      }
    },
    [canRedo, canUndo, sankeyState.historyIndex, updateSankey]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyListener);
    return () => window.removeEventListener("keydown", keyListener);
  }, [keyListener]);

  return (
    <Wrapper>
      <Icon
        onClick={() =>
          updateSankey({
            type: "undoAction",
            index: sankeyState.historyIndex,
          })
        }
        disabled={!canUndo}
        className="hlp-5"
        aria-label="Undo last action"
      >
        <FaUndo viewBox="-80 -80 612 612" />
      </Icon>
      <Icon
        onClick={() => setIsPrinting(true)}
        className="hlp-10"
        aria-label="Print chart"
      >
        <AiOutlinePrinter />
      </Icon>
      <Icon
        onClick={() => setHelpRequired(true)}
        className="hlp-11"
        aria-label="Get help"
      >
        <IoMdHelp />
      </Icon>
      <Icon
        onClick={() =>
          updateSankey({
            type: "redoAction",
            index: sankeyState.historyIndex,
          })
        }
        disabled={!canRedo}
        className="hlp-5"
        aria-label="Redo last action"
      >
        <FaRedo viewBox="-60 -80 612 612" />
      </Icon>
    </Wrapper>
  );
};
