import { h } from "preact";
import styled from "styled-components";

import { HeaderControls, SortControls } from "components";

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
  nodeFilter,
  setNodeFilter,
  setIsPrinting,
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
        setIsPrinting={setIsPrinting}
        nodeFilter={nodeFilter}
        setNodeFilter={setNodeFilter}
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
