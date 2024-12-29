import styled from "styled-components";

import { AiOutlineHighlight } from "react-icons/ai";
import { CgErase, CgColorPicker } from "react-icons/cg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useCallback } from "preact/hooks";

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
  sankeyState,
  updateSankey,
  removeMenu,
  openColourPicker,
}) => {
  const { isHidden, isHighlighted } = getLinkStates(
    links,
    sankeyState.highlightedLinks,
    sankeyState.hiddenLinks
  );

  const handleHighlight = useCallback(
    (highLightState) => {
      if (highLightState) {
        updateSankey({ type: "unhighlightLinks", links });
      } else {
        updateSankey({ type: "highlightLinks", links });
      }
      removeMenu();
    },
    [links, removeMenu, updateSankey]
  );

  const handleHide = useCallback(
    (hiddenState) => {
      if (hiddenState) {
        updateSankey({ type: "unhideLinks", links });
      } else {
        updateSankey({ type: "hideLinks", links });
      }
      removeMenu();
    },
    [links, removeMenu, updateSankey]
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
      <Option onClick={openColourPicker}>
        <Icon>
          <CgColorPicker />
        </Icon>
        <span style={{ paddingTop: "2px" }}>Change colour</span>
      </Option>
    </Wrapper>
  );
};
