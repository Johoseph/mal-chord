import styled from "styled-components";
import { useState, useEffect } from "preact/hooks";
import { HexColorPicker } from "react-colorful";
import { BsCheck, BsX } from "react-icons/bs";

import { useDebounce } from "hooks";

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
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
    </div>
  );
};
