import Slider from "rc-slider";
import styled from "styled-components";

import "rc-slider/assets/index.css";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SliderWrap = styled.div`
  padding: 0 7px;
`;

const StyledSlider = styled((props) => <Slider {...props} />)`
  & .rc-slider-rail {
    width: calc(100% + 14px);
    left: -7px;
  }

  & .rc-slider-track {
    left: -7px !important;
  }
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-top: 10px;
`;

export const SliderInput = ({ leftLabel, rightLabel, hideLabel = false }) => {
  return (
    <Wrapper>
      <SliderWrap>
        <StyledSlider />
      </SliderWrap>
      {!hideLabel && (
        <Label>
          <span>{leftLabel ?? "Low"}</span>
          <span>{rightLabel ?? "High"}</span>
        </Label>
      )}
    </Wrapper>
  );
};
