import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import styled from "styled-components";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";

import { Dropdown } from "../../general/Dropdown";
import { HistoryContext } from "../../../contexts";

const sortOptions = [
  {
    value: "alphabetical",
    label: "alphabetical",
  },
  {
    value: "date",
    label: "last updated",
  },
  {
    value: "popularity",
    label: "popularity",
  },
  {
    value: "ranking",
    label: "ranking",
  },
  {
    value: "score",
    label: "your score",
  },
];

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Sort = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 5px;
  font-size: 0.9rem;
`;

const SortButtonWrapper = styled.div`
  margin-right: 6px;
  width: 1.5rem;
  height: 1.5rem;
`;

const SortButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: none;
  background: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;

  &:hover,
  :focus {
    background: #252525;
  }
`;

export const SortControls = ({
  startSort,
  setStartSort,
  endSort,
  setEndSort,
}) => {
  const { writeToHistory } = useContext(HistoryContext);

  const handleStartSortDirection = useCallback(() => {
    setStartSort((prev) => {
      const newSort = {
        type: prev.type,
        direction: prev.direction === "ASC" ? "DESC" : "ASC",
      };

      writeToHistory([
        {
          fn: setStartSort,
          undo: prev,
          redo: newSort,
        },
      ]);

      return newSort;
    });
  }, [setStartSort, writeToHistory]);

  const handleStartSortType = useCallback(
    (val) => {
      setStartSort((prev) => {
        const newSort = { type: val, direction: prev.direction };

        if (val !== prev.type)
          writeToHistory([
            {
              fn: setStartSort,
              undo: prev,
              redo: newSort,
            },
          ]);

        return newSort;
      });
    },
    [setStartSort, writeToHistory]
  );

  const handleEndSortDirection = useCallback(() => {
    setEndSort((prev) => {
      const newSort = {
        type: prev.type,
        direction: prev.direction === "ASC" ? "DESC" : "ASC",
      };

      writeToHistory([
        {
          fn: setEndSort,
          undo: prev,
          redo: newSort,
        },
      ]);

      return newSort;
    });
  }, [setEndSort, writeToHistory]);

  return (
    <Sort>
      <Flex className="hlp-6 right-25">
        <SortButtonWrapper>
          <SortButton
            onClick={handleStartSortDirection}
            aria-label="Toggle anime sort direction"
          >
            {startSort.direction === "ASC" ? (
              <HiArrowNarrowUp />
            ) : (
              <HiArrowNarrowDown />
            )}
          </SortButton>
        </SortButtonWrapper>
        <Dropdown
          value={startSort.type}
          setValue={handleStartSortType}
          options={sortOptions}
          minWidth={120}
        />
      </Flex>
      <Flex className="hlp-6">
        <SortButtonWrapper>
          <SortButton
            onClick={handleEndSortDirection}
            aria-label="Toggle end category sort direction"
          >
            {endSort.direction === "ASC" ? (
              <HiArrowNarrowUp />
            ) : (
              <HiArrowNarrowDown />
            )}
          </SortButton>
        </SortButtonWrapper>
        {endSort.type}
      </Flex>
    </Sort>
  );
};
