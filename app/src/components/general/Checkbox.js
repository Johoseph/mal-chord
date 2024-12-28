import { useState } from "preact/hooks";
import styled from "styled-components";

import { FiCheck } from "react-icons/fi";

const Wrapper = styled.div`
  display: flex;
  position: relative;
  margin: 5px 0px;
`;

const Input = styled.input`
  position: absolute;
  background: none;
  opacity: 0;
`;

const Label = styled.label`
  display: flex;
  position: relative;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    & svg {
      visibility: visible;
    }

    ${(props) =>
      props.isChecked &&
      `
      & div {
        background: #3963c3;
        border-color: #3963c3;
      }
    `}
  }

  ${(props) =>
    props.isFocused &&
    `
      & svg {
        visibility: visible !important;
      }

      ${
        props.isChecked &&
        `
          & div {
            background: #3963c3 !important;
            border-color: #3963c3 !important;
          }
        `
      }
  `};
`;

const CheckBoxWrapper = styled.div`
  height: 20px;
  width: 20px;
  border: 1px solid
    ${(props) =>
      props.theme === "dark" ? "var(--dark-text)" : "rgb(51, 51, 51)"};
  border-radius: 2px;
  margin-right: 4px;
  padding: 1px;
  transition: background 300ms, border-color 300ms;

  ${(props) =>
    props.isChecked
      ? `
      background: #2e51a2;
      border-color: #2e51a2;

      & svg {
        color: white;
      }
    `
      : `
      & svg {
        visibility: hidden;
      }
  `};
`;

const Text = styled.span`
  margin-left: 4px;
  user-select: none;
`;

const CheckMark = styled(FiCheck)`
  width: 100%;
  height: 100%;
  color: #ffffff;
  transition: color 300ms;
`;

export const Checkbox = ({
  label,
  id,
  checked = false,
  onChange,
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    onChange();
    e.target.blur();
  };

  return (
    <Wrapper>
      <Input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        type="checkbox"
        id={id}
        checked={checked}
        aria-label={label}
        aria-checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <Label
        htmlFor={id}
        isChecked={checked}
        isFocused={focused}
        disabled={disabled}
      >
        <CheckBoxWrapper isChecked={checked}>
          <CheckMark />
        </CheckBoxWrapper>
        <Text>{label}</Text>
      </Label>
    </Wrapper>
  );
};
