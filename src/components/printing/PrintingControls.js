import styled from "styled-components";
import { Radio, Slider } from "components";

const pageSizes = ["A4", "A3", "A2"];
const pageOrientations = ["Portrait", "Landscape"];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  padding-right: 40px;
  overflow-y: auto;
`;

const Label = styled.h3`
  font-weight: 400;
  font-size: 1.2rem;
  margin: 0;
  margin-bottom: 10px;
`;

const FieldWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  & button:not(:last-of-type) {
    margin-right: 15px;
  }
`;

export const PrintingControls = ({ pageState, dispatch }) => {
  return (
    <Wrapper>
      <Label>Page Orientation</Label>
      <FieldWrap>
        {pageOrientations.map((orientation) => (
          <Radio
            key={orientation}
            label={orientation}
            isActive={pageState.pageOrientation === orientation}
            onClick={() => {
              if (pageState.pageOrientation !== orientation)
                dispatch({ type: "updateOrientation", payload: orientation });
            }}
            ariaLabel={`Set page orientation to ${orientation}`}
          />
        ))}
      </FieldWrap>
      <Label>Page Size</Label>
      <FieldWrap>
        {pageSizes.map((size) => (
          <Radio
            key={size}
            label={size}
            isActive={pageState.pageSize === size}
            onClick={() => {
              if (pageState.pageSize !== size)
                dispatch({ type: "updateSize", payload: size });
            }}
            ariaLabel={`Set page size to ${size}`}
          />
        ))}
      </FieldWrap>
      <Label>Header Details</Label>
      <FieldWrap>
        {["On", "Off"].map((state) => (
          <Radio
            key={state}
            label={state}
            isActive={pageState.headerState === state}
            onClick={() => {
              if (pageState.headerState !== state)
                dispatch({ type: "updateHeader", payload: state });
            }}
            ariaLabel={`Toggle header ${state}`}
          />
        ))}
      </FieldWrap>
      <Label>Anime Thumbnails</Label>
      <FieldWrap>
        {["On", "Off"].map((state) => (
          <Radio
            key={state}
            label={state}
            isActive={pageState.thumbnailState === state}
            onClick={() => {
              if (pageState.thumbnailState !== state)
                dispatch({ type: "updateThumbnail", payload: state });
            }}
            ariaLabel={`Toggle anime thumbnail ${state}`}
          />
        ))}
      </FieldWrap>
      <Label>Node Size</Label>
      <FieldWrap>
        <Slider
          leftLabel="Smallest"
          rightLabel="Largest"
          minVal={10}
          maxVal={100}
          defaultValue={pageState.nodeSize}
          onChange={(val) => {
            if (pageState.nodeSize !== val)
              dispatch({ type: "updateNodeSize", payload: val });
          }}
        />
      </FieldWrap>
      <Label>Node Padding</Label>
      <FieldWrap>
        <Slider
          leftLabel="Smallest"
          rightLabel="Largest"
          minVal={5}
          maxVal={60}
          defaultValue={pageState.nodePadding}
          onChange={(val) => {
            if (pageState.nodePadding !== val)
              dispatch({ type: "updateNodePadding", payload: val });
          }}
        />
      </FieldWrap>
    </Wrapper>
  );
};
