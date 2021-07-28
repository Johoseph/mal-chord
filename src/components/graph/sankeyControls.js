import { h } from "preact";
import styled from "styled-components";

import { Dropdown } from "../general/dropdown";

const Wrapper = styled.div`
  margin-bottom: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 5px;
  font-size: 1.5rem;
`;

const Chord = styled.div`
  background: #2e51a2;
  height: 0.3rem;
  width: 100%;
  position: relative;
  top: 2px;
  margin: 0 20px;
`;

const optionCategories = [
  {
    value: "score",
    label: "your score",
  },
  {
    value: "popularity",
    label: "fan popularity",
  },
];

export const SankeyControls = ({
  setStartSort,
  setEndSort,
  setEndCategory,
  endCategory,
}) => {
  return (
    <Wrapper>
      <Header>
        <span>anime</span>
        <Chord />
        <Dropdown
          value={endCategory}
          setValue={setEndCategory}
          options={optionCategories}
        />
      </Header>
    </Wrapper>
  );
};
