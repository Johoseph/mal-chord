import { useReducer } from "preact/hooks";
import styled from "styled-components";
import Modal from "react-modal";

import { AiOutlinePrinter } from "react-icons/ai";
import { BsX } from "react-icons/bs";

import { useLockBodyScroll } from "hooks";
import { PrintingDocument, PrintingControls } from "components";

const StyledModal = styled((props) => <Modal {...props} />)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  padding: 30px;

  width: 80vw;
  height: 70vh;
  min-width: 80vw;
  min-height: 70vh;

  background: #1f1f1f;
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderText = styled.h2`
  margin: 0;
  font-weight: 400;
  display: flex;
  align-items: center;
  font-size: 1.7rem;

  & svg {
    margin-right: 10px;
  }
`;

const Body = styled.div`
  display: flex;
  height: 100%;
`;

const CloseButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
  border: none;
  background: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  font-size: 2rem;

  &:hover,
  :focus {
    background: #252525;
  }
`;

const pageReducer = (state, action) => {
  switch (action.type) {
    case "updateSize":
      return { ...state, pageSize: action.payload };
    case "updateOrientation":
      return { ...state, pageOrientation: action.payload };
    case "updateHeader":
      return { ...state, headerState: action.payload };
    default:
      return state;
  }
};

export const PrintingModal = ({ isPrinting, setIsPrinting, chordSvg }) => {
  useLockBodyScroll(isPrinting);

  const [pageState, dispatchPageState] = useReducer(pageReducer, {
    pageSize: "A4",
    pageOrientation: "Portrait",
    headerState: "On",
  });

  return (
    <StyledModal
      isOpen={isPrinting}
      onRequestClose={() => setIsPrinting(false)}
      appElement={document.querySelector("#app")}
      onAfterOpen={() => window.scrollTo(0, 0)}
      style={{
        overlay: {
          background: "rgb(0, 0, 0, 0.5)",
          zIndex: 2,
        },
      }}
    >
      <Wrapper>
        <Header>
          <HeaderText>
            <AiOutlinePrinter /> Chord Printer
          </HeaderText>
          <CloseButton
            onClick={() => setIsPrinting(false)}
            aria-label="Close printing modal"
          >
            <BsX />
          </CloseButton>
        </Header>
        <Body>
          <PrintingControls
            pageState={pageState}
            dispatch={dispatchPageState}
          />
          <PrintingDocument chordSvg={chordSvg} pageState={pageState} />
        </Body>
      </Wrapper>
    </StyledModal>
  );
};
