import styled from "styled-components";
import { useState } from "preact/hooks";
import { HexColorPicker } from "react-colorful";

import { useDebounce } from "hooks";

const Wrapper = styled.div``;

export const ColourPicker = ({ colour, confirmColour }) => {
  const [localColour, setLocalColour] = useState(colour);

  const debounceColour = useDebounce(localColour, 200);

  return (
    <Wrapper>
      <HexColorPicker color={debounceColour} onChange={setLocalColour} />
      <button onClick={() => confirmColour(debounceColour)}>CONFIRM</button>
    </Wrapper>
  );
};
