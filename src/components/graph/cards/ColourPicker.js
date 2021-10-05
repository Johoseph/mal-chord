import styled from "styled-components";
import { useState, useEffect } from "preact/hooks";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { BsCheck, BsX } from "react-icons/bs";

import { useDebounce } from "hooks";

const ControlsWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
`;

const Controls = styled.div`
  display: flex;
`;

const Button = styled.button`
  border-radius: 9999px;
  border: none;
  background: #2e51a2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  width: 2rem;
  height: 2rem;
  font-size: 1.3rem;

  &:last-of-type {
    margin-left: 10px;
  }

  &:hover,
  :focus-visible {
    background: #2a4890;
  }
`;

const ColourInput = styled(HexColorInput)`
  width: 100px;
  margin-right: 5px;
  outline: none;
  background: #1f1f1f;
  border: 1px solid #6d6d6d;
  height: 32px;
  border-radius: 10px;
  font-family: Roboto;
  font-size: 1.1rem;
  font-weight: 300;
  text-transform: uppercase;
  text-align: center;
  transition: border 300ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover,
  :focus-visible {
    border: 1px solid #979797;
  }
`;

export const ColourPicker = ({
  colour: { colour, name },
  updateSankey,
  removeMenu,
}) => {
  const [localColour, setLocalColour] = useState(colour);

  const debounceColour = useDebounce(localColour, 150);

  useEffect(() => {
    updateSankey({
      type: "updateColours",
      isTest: true,
      colour: { name, colour: debounceColour },
    });
  }, [debounceColour, name, updateSankey]);

  return (
    <div>
      <HexColorPicker color={debounceColour} onChange={setLocalColour} />
      <ControlsWrap>
        <ColourInput
          color={debounceColour}
          onChange={setLocalColour}
          maxLength={6}
        />
        <Controls>
          <Button
            onClick={() => {
              updateSankey({ type: "revertColour" });
              removeMenu();
            }}
            aria-label="Revert colour selection"
          >
            <BsX />
          </Button>
          <Button
            onClick={() => {
              updateSankey({
                type: "updateColours",
                colour: { name, colour: debounceColour },
              });
              removeMenu();
            }}
            aria-label="Confirm colour selection"
          >
            <BsCheck />
          </Button>
        </Controls>
      </ControlsWrap>
    </div>
  );
};
