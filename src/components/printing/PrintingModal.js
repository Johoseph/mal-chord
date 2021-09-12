import { h } from "preact";
import styled from "styled-components";
import Modal from "react-modal";

import { useLockBodyScroll } from "hooks";
import { ChordDocument } from "components";

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
  display: flex;
  height: 100%;
`;

export const PrintingModal = ({ isPrinting, setIsPrinting }) => {
  useLockBodyScroll(isPrinting);

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
        <div style={{ width: "30%" }}>Controls div</div>
        <div style={{ width: "70%" }}>
          <ChordDocument />
        </div>
      </Wrapper>
    </StyledModal>
  );
};
