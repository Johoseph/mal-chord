import { default as SliderImport } from "rc-slider";
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

const StyledSlider = styled((props) => <SliderImport {...props} />)`
  & .rc-slider-rail {
    width: calc(100% + 12px);
    left: -6px;
  }

  & .rc-slider-track {
    left: -7px !important;
    background-color: #2e51a2;
    border-radius: 6px 0 0 6px;
  }

  & .rc-slider-handle {
    width: 18px;
    height: 18px;
    border: 5px solid #1f1f1f;

    &::before {
      content: "";
      width: 14px;
      height: 14px;
      border: 2px solid #ffffff;
      border-radius: 100%;
      position: absolute;
      left: -5px;
      top: -5px;
    }

    &:active {
      box-shadow: none;

      &::before {
        box-shadow: 0 0 5px #ffffff;
      }
    }
  }
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-top: 10px;
`;

export const Slider = ({
  leftLabel,
  rightLabel,
  hideLabel = false,
  minVal,
  maxVal,
  defaultValue,
  onChange,
}) => {
  return (
    <Wrapper>
      <SliderWrap>
        <StyledSlider
          min={minVal}
          max={maxVal}
          onAfterChange={onChange}
          defaultValue={defaultValue}
        />
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
