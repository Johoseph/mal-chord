import { h } from "preact";
import styled from "styled-components";
import { useContext } from "preact/hooks";

import { HomeHeader } from "./home/HomeHeader";
import { SankeyLoading } from "../graph/loading/SankeyLoading";
import { UserContext } from "../../contexts";
import { useTabVisible } from "../../hooks";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
`;

export const HomePath = () => {
  const { setLoginType, mobileWidth } = useContext(UserContext);
  const { tabVisible } = useTabVisible();

  window.addEventListener("storage", (e) => {
    if (![].includes(e.key)) window.location.reload();
  });

  return (
    <Wrapper>
      <HomeHeader setLoginType={setLoginType} mobileWidth={mobileWidth} />
      {tabVisible && (
        <SankeyLoading
          customDimesions={{ height: 55, width: 75 }}
          hasColor={true}
          startFresh={true}
        />
      )}
    </Wrapper>
  );
};
