import styled from "styled-components";
import { useState } from "preact/hooks";
import { HexColorPicker } from "react-colorful";

const Wrapper = styled.div``;

export const ColourPicker = ({ colour, confirmColour }) => {
  const [localColour, setLocalColour] = useState(colour);

  return (
    <Wrapper>
      <HexColorPicker color={localColour} onChange={setLocalColour} />
      <button onClick={() => confirmColour(localColour)}>CONFIRM</button>
    </Wrapper>
  );
};
