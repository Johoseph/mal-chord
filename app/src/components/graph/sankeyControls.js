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
  sankeyState,
  updateSankey,
  setIsPrinting,
  setHelpRequired,
}) => {
  return (
    <Wrapper>
      <HeaderControls
        sankeyState={sankeyState}
        updateSankey={updateSankey}
        setIsPrinting={setIsPrinting}
        setHelpRequired={setHelpRequired}
      />
      <SortControls sankeyState={sankeyState} updateSankey={updateSankey} />
    </Wrapper>
  );
};
