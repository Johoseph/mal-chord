import { h } from "preact";
import styled from "styled-components";
import { useCallback, useContext, useState } from "preact/hooks";
import { HiOutlineFilter } from "react-icons/hi";

import {
  Dropdown,
  AnimeCountFilter,
  SankeyStateTraversal,
  Tooltip,
  FilterList,
} from "components";
import { HistoryContext } from "contexts";

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
  }

  &:hover,
  :focus-visible {
    background: #252525;
  }
`;

export const HeaderControls = ({
  startCategory,
  setStartCategory,
  endCategory,
  setEndCategory,
  setIsPrinting,
  count,
  limit,
  setLimit,
}) => {
  const [filterTooltip, setFilterTooltip] = useState();

  const { writeToHistory } = useContext(HistoryContext);

  const handleSetStartCategory = useCallback(
    (val) => {
      if (startCategory !== val) {
        let toWrite = [];

        setEndCategory((prev) => {
          toWrite.push({
            fn: setEndCategory,
            undo: prev,
            redo: "score",
          });

          return "score";
        });

        setStartCategory((prev) => {
          toWrite.push({
            fn: setStartCategory,
            undo: prev,
            redo: val,
          });

          return val;
        });

        writeToHistory(toWrite);
      }
    },
    [startCategory, setEndCategory, setStartCategory, writeToHistory]
  );

  const handleSetEndCategory = useCallback(
    (val) => {
      setEndCategory((prev) => {
        if (val !== prev)
          writeToHistory([
            {
              fn: setEndCategory,
              undo: prev,
              redo: val,
            },
          ]);

        return val;
      });
    },
    [setEndCategory, writeToHistory]
  );

  return (
    <Header>
      <Bound>
        <BoundWrap bound="start">
          <Dropdown
            value={startCategory}
            setValue={handleSetStartCategory}
            options={startCategoryOptions}
            minWidth={150}
            alignment="left"
            optionFontSize={1}
            className="hlp-3 right-60"
          />
          <AnimeCountFilter count={count} limit={limit} setLimit={setLimit} />
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
          >
            <HiOutlineFilter viewBox="0 -1 24 24" />
          </FilterButton>
          <Chord />
        </BoundWrap>
      </Bound>
      <SankeyStateTraversal setIsPrinting={setIsPrinting} />
      <Bound>
        <BoundWrap bound="end">
          <Chord />
          <Dropdown
            value={endCategory}
            setValue={handleSetEndCategory}
            options={endCategoryOptions.filter(
              (option) => option[startCategory]
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
        >
          <FilterList />
        </Tooltip>
      )}
    </Header>
  );
};
