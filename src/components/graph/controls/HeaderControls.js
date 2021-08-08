import { h } from "preact";
import styled from "styled-components";
import { useCallback, useContext } from "preact/hooks";

import { Dropdown } from "../../general/Dropdown";
import { AnimeCountFilter } from "./../AnimeCountFilter";
import { SankeyStateTraversal } from "./../SankeyStateTraversal";
import { HistoryContext } from "../../../contexts";

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
  endCategory,
  setEndCategory,
  categoryOptions,
  count,
  limit,
  setLimit,
}) => {
  const { writeToHistory } = useContext(HistoryContext);

  const handleEndSortCategory = useCallback(
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
          <span>anime</span>
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
            setValue={handleEndSortCategory}
            options={categoryOptions}
            minWidth={150}
            alignment="right"
            optionFontSize={1}
            className="hlp-5 left-50"
          />
        </BoundWrap>
      </Bound>
    </Header>
  );
};
