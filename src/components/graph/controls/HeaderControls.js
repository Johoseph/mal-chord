import { h } from "preact";
import styled from "styled-components";
import { useCallback, useContext } from "preact/hooks";

import { Dropdown } from "../../general/Dropdown";
import { AnimeCountFilter } from "./../AnimeCountFilter";
import { SankeyStateTraversal } from "./../SankeyStateTraversal";
import { HistoryContext } from "../../../contexts";

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

export const HeaderControls = ({
  startCategory,
  setStartCategory,
  endCategory,
  setEndCategory,
  count,
  limit,
  setLimit,
}) => {
  const { writeToHistory } = useContext(HistoryContext);

  const handleSetStartCategory = useCallback(
    (val) => {
      setStartCategory((prev) => {
        if (val !== prev)
          writeToHistory([
            {
              fn: setStartCategory,
              undo: prev,
              redo: val,
            },
          ]);

        return val;
      });
    },
    [setStartCategory, writeToHistory]
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
          <Chord />
        </BoundWrap>
      </Bound>
      <SankeyStateTraversal />
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
    </Header>
  );
};
