import styled from "styled-components";

const RadioButton = styled.button`
  border: 0;
  background: none;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  outline: none;
  cursor: pointer;
  padding: 2px 0px;
  padding-right: 5px;

  &:hover,
  :focus-visible {
    div {
      border: 2px solid #ffffff;
    }
  }
`;

const RadioLabel = styled.span`
  display: flex;
  align-items: center;
  height: 100%;
  padding-top: 1px;
`;

const RadioCircle = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid #929292;
  border-radius: 100%;
  margin-right: 8px;
  position: relative;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    background: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 100%;
    transform: translate(-50%, -50%) scale(0, 0);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ${(props) =>
    props.isActive &&
    `
    border: 2px solid #ffffff;
    &::before {
      transform: translate(-50%, -50%) scale(1, 1);
    }
  `}
`;

export const Radio = ({ onClick, ariaLabel, isActive, label }) => {
  return (
    <RadioButton onClick={onClick} aria-label={ariaLabel}>
      <RadioCircle className="circle" isActive={isActive} />
      <RadioLabel>{label}</RadioLabel>
    </RadioButton>
  );
};
