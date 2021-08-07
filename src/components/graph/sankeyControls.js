import { h } from "preact";
import styled from "styled-components";

import { HeaderControls } from "./controls/HeaderControls";
import { SortControls } from "./controls/SortControls";

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto 30px auto;

  @media (max-width: 1000px) {
    width: 95%;
  }
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
  count,
  limit,
  setLimit,
}) => {
  return (
    <Wrapper>
      <HeaderControls
        endCategory={endCategory}
        setEndCategory={setEndCategory}
        categoryOptions={categoryOptions}
        count={count}
        limit={limit}
        setLimit={setLimit}
      />
      <SortControls
        startSort={startSort}
        setStartSort={setStartSort}
        endSort={endSort}
        setEndSort={setEndSort}
        sortOptions={sortOptions}
      />
    </Wrapper>
  );
};
