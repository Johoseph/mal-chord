import { h } from "preact";
import styled from "styled-components";

import { HeaderControls } from "./controls/HeaderControls";
import { SortControls } from "./controls/SortControls";

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto 30px auto;

  @media (max-width: 1350px) {
    width: 90%;
  }
`;

export const SankeyControls = ({
  startCategory,
  setStartCategory,
  setStartSort,
  setEndSort,
  setEndCategory,
  startSort,
  endSort,
  endCategory,
  count,
  limit,
  setLimit,
}) => {
  return (
    <Wrapper>
      <HeaderControls
        startCategory={startCategory}
        setStartCategory={setStartCategory}
        endCategory={endCategory}
        setEndCategory={setEndCategory}
        count={count}
        limit={limit}
        setLimit={setLimit}
      />
      <SortControls
        startSort={startSort}
        setStartSort={setStartSort}
        endSort={endSort}
        setEndSort={setEndSort}
      />
    </Wrapper>
  );
};
