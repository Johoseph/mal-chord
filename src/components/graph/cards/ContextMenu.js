import { h } from "preact";
import styled from "styled-components";

import { AiOutlineHighlight } from "react-icons/ai";
import { CgErase } from "react-icons/cg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useCallback, useContext } from "preact/hooks";
import { HistoryContext } from "contexts";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 180px;
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  background: none;
  padding: 5px 10px;
  margin: 5px 5px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover,
  :focus-visible {
    background: #2b2b2b;
  }
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  margin-right: 10px;
`;

const getLinkStates = (links, highlightedLinks, hiddenLinks) => {
  return {
    isHidden: links.every((link) => hiddenLinks.includes(link)),
    isHighlighted: links.every((link) => highlightedLinks.includes(link)),
  };
};

export const ContextMenu = ({
  links,
  highlightedLinks,
  setHighlightedLinks,
  hiddenLinks,
  setHiddenLinks,
  removeMenu,
}) => {
  const { writeToHistory } = useContext(HistoryContext);

  const { isHidden, isHighlighted } = getLinkStates(
    links,
    highlightedLinks,
    hiddenLinks
  );

  const handleHighlight = useCallback(
    (highLightState) => {
      if (highLightState) {
        setHighlightedLinks((prev) => {
          const newLinks = prev.filter((item) => !links.includes(item));

          writeToHistory([
            {
              fn: setHighlightedLinks,
              undo: prev,
              redo: newLinks,
            },
          ]);

          return newLinks;
        });
      } else {
        let toWrite = [];

        setHighlightedLinks((prev) => {
          const newLinks = [...prev, ...links];

          toWrite.push({
            fn: setHighlightedLinks,
            undo: prev,
            redo: newLinks,
          });

          return newLinks;
        });

        setHiddenLinks((prev) => {
          const newLinks = prev.filter((item) => !links.includes(item));

          toWrite.push({
            fn: setHiddenLinks,
            undo: prev,
            redo: newLinks,
          });

          return newLinks;
        });

        writeToHistory(toWrite);
      }
      removeMenu();
    },
    [links, removeMenu, setHiddenLinks, setHighlightedLinks, writeToHistory]
  );

  const handleHide = useCallback(
    (hiddenState) => {
      if (hiddenState) {
        setHiddenLinks((prev) => {
          const newLinks = prev.filter((item) => !links.includes(item));

          writeToHistory([
            {
              fn: setHiddenLinks,
              undo: prev,
              redo: newLinks,
            },
          ]);

          return newLinks;
        });
      } else {
        let toWrite = [];

        setHiddenLinks((prev) => {
          const newLinks = [...prev, ...links];

          toWrite.push({
            fn: setHiddenLinks,
            undo: prev,
            redo: newLinks,
          });

          return newLinks;
        });

        setHighlightedLinks((prev) => {
          const newLinks = prev.filter((item) => !links.includes(item));

          toWrite.push({
            fn: setHighlightedLinks,
            undo: prev,
            redo: newLinks,
          });

          return newLinks;
        });

        writeToHistory(toWrite);
      }
      removeMenu();
    },
    [links, removeMenu, setHiddenLinks, setHighlightedLinks, writeToHistory]
  );

  return (
    <Wrapper>
      <Option onClick={() => handleHighlight(isHighlighted)}>
        <Icon>{isHighlighted ? <CgErase /> : <AiOutlineHighlight />}</Icon>
        <span style={{ paddingTop: "2px" }}>
          {isHighlighted ? "Unhighlight" : "Highlight"} links
        </span>
      </Option>
      <Option onClick={() => handleHide(isHidden)}>
        <Icon>
          {isHidden ? (
            <FiEye viewBox="-2 -2 28 28" />
          ) : (
            <FiEyeOff viewBox="-2 -2 28 28" />
          )}
        </Icon>
        <span style={{ paddingTop: "2px" }}>
          {isHidden ? "Show" : "Hide"} links
        </span>
      </Option>
    </Wrapper>
  );
};
