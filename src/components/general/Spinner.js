import styled, { keyframes } from "styled-components";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div`
  font-size: 6rem;
  position: absolute;
  & svg {
    animation: ${rotate} 2s linear infinite;
  }
`;

export const Spinner = () => {
  return (
    <StyledSpinner>
      <AiOutlineLoading3Quarters />
    </StyledSpinner>
  );
};
