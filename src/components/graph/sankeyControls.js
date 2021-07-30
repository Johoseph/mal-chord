import { h } from "preact";
import styled from "styled-components";

import { Dropdown } from "../general/dropdown";

const Wrapper = styled.div`
  margin-bottom: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
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

const Sort = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 5px;
  font-size: 1rem;
`;

export const SankeyControls = ({
  setStartSort,
  setEndSort,
  setEndCategory,
  startSort,
  endSort,
  endCategory,
  categoryOptions,
  sortOptions,
}) => {
  return (
    <Wrapper>
      <Header>
        <span>anime</span>
        <Chord />
        <Dropdown
          value={endCategory}
          setValue={setEndCategory}
          options={categoryOptions}
          minWidth={150}
        />
      </Header>
      <Sort>
        <Dropdown
          value={startSort.type}
          setValue={(val) =>
            setStartSort((prev) => ({ type: val, direction: prev.direction }))
          }
          options={sortOptions}
          minWidth={120}
        />
        <span>{endSort.type}</span>
      </Sort>
    </Wrapper>
  );
};
