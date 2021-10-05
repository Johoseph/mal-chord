import { h } from "preact";
import styled from "styled-components";
import { useState } from "preact/hooks";
import { HiOutlineFilter } from "react-icons/hi";

import {
  Dropdown,
  AnimeCountFilter,
  HeaderSubControls,
  Tooltip,
  FilterList,
} from "components";

const startCategoryOptions = [
  {
    value: "anime",
    label: "anime",
  },
  {
    value: "manga",
    label: "manga",
  },
];

const endCategoryOptions = [
  {
    value: "author",
    label: "author",
    anime: false,
    manga: true,
  },
  {
    value: "rating",
    label: "anime rating",
    anime: true,
    manga: false,
  },
  {
    value: "genre",
    label: "genre",
    anime: true,
    manga: true,
  },
  {
    value: "studio",
    label: "studio",
    anime: true,
    manga: false,
  },
  {
    value: "status",
    label: "your list status",
    anime: true,
    manga: true,
  },
  {
    value: "score",
    label: "your score",
    anime: true,
    manga: true,
  },
];

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 5px;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Chord = styled.div`
  background: #2e51a2;
  height: 0.3rem;
  width: 100%;
  position: relative;
  top: 2px;
  margin: 0 20px;
`;

const Bound = styled.div`
  display: flex;
  flex: 1;
`;

const BoundWrap = styled.span`
  display: flex;
  align-items: center;
  width: 100%;

  ${(props) =>
    props.bound === "start" ? `margin-right: auto;` : `margin-left: auto;`}
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  min-width: 2rem;
  height: 2rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  background: #1f1f1f;
  border: none;
  outline: none;

  & svg {
    font-size: 1.1rem;
    fill: transparent;
    transition: fill 300ms;
  }

  &:hover,
  :focus-visible {
    background: #252525;
  }

  ${(props) =>
    props.filterCount > 0 &&
    `
      & svg {
        fill: rgba(255, 255, 255, ${props.filterCount * 0.25});
      }
  `}
`;

export const HeaderControls = ({
  sankeyState,
  updateSankey,
  setIsPrinting,
  setHelpRequired,
}) => {
  const [filterTooltip, setFilterTooltip] = useState();

  return (
    <Header>
      <Bound>
        <BoundWrap bound="start">
          <Dropdown
            value={sankeyState.startCategory}
            setValue={(val) =>
              updateSankey({ type: "updateStartCategory", startCategory: val })
            }
            options={startCategoryOptions}
            minWidth={150}
            alignment="left"
            optionFontSize={1}
            className="hlp-3 right-60"
          />
          <AnimeCountFilter
            sankeyState={sankeyState}
            updateSankey={updateSankey}
          />
          <FilterButton
            aria-label="Filter by status"
            onClick={(e) => {
              let button = e.target;

              while (button.nodeName !== "BUTTON")
                button = button.parentElement;

              const boundingRect = button.getBoundingClientRect();

              setFilterTooltip({
                x: boundingRect.left,
                y: boundingRect.bottom + 10,
              });
            }}
            className="hlp-4"
            filterCount={
              sankeyState.nodeFilter.filter(
                (category) => category.active === false
              ).length
            }
          >
            <HiOutlineFilter viewBox="0 -2 24 24" />
          </FilterButton>
          <Chord />
        </BoundWrap>
      </Bound>
      <HeaderSubControls
        sankeyState={sankeyState}
        updateSankey={updateSankey}
        setIsPrinting={setIsPrinting}
        setHelpRequired={setHelpRequired}
      />
      <Bound>
        <BoundWrap bound="end">
          <Chord />
          <Dropdown
            value={sankeyState.endCategory}
            setValue={(val) =>
              updateSankey({ type: "updateEndCategory", endCategory: val })
            }
            options={endCategoryOptions.filter(
              (option) => option[sankeyState.startCategory]
            )}
            minWidth={150}
            alignment="right"
            optionFontSize={1}
            className="hlp-6 left-50"
          />
        </BoundWrap>
      </Bound>
      {filterTooltip && (
        <Tooltip
          x={filterTooltip.x}
          y={filterTooltip.y}
          removeFn={() => setFilterTooltip(undefined)}
          pd={15}
        >
          <FilterList
            nodeFilter={sankeyState.nodeFilter}
            updateSankey={updateSankey}
          />
        </Tooltip>
      )}
    </Header>
  );
};
