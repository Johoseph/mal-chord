import styled from "styled-components";

import MALLogo from "assets/branding/mal.svg";
import { useWindowDimensions } from "hooks";
import { MALChord } from "components";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 75%;
  margin: 50px auto;

  ${(props) =>
    props.isMobile &&
    `
    flex-direction: column;
    margin: 0 auto 50px auto;
  `}

  @media (max-width: 1350px) {
    width: 90%;
  }
`;

const Button = styled.button`
  background: #2e51a2;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 15px 20px;
  margin-top: 20px;
  min-height: 55px;
  min-width: 80px;
  border-radius: 9999px;
  cursor: pointer;
  white-space: nowrap;

  display: flex;
  align-items: center;

  & span {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &:hover,
  :focus-visible {
    background: #2a4890;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MALLogoImg = styled.img`
  margin-left: 6px;
  height: 1.4rem;
`;

const InfoMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 30px;

  background: #1f1f1f;
  border: 2px solid #2e51a2;
  border-radius: 10px;
  padding: 10px 20px;
`;

const Title = styled.div`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const Info = styled.div`
  font-weight: 300;
`;

export const HomeHeader = ({ setLoginType, mobileWidth }) => {
  const { windowWidth } = useWindowDimensions();

  const isMobile = windowWidth < mobileWidth;

  return (
    <Wrapper isMobile={isMobile}>
      <MALChord />
      {isMobile ? (
        <InfoMessage>
          <Title>
            Sorry, but your device does not meet the minimum screen width
            required to use MAL Chord.
          </Title>
          <Info>
            To access the site, try using a device with a larger screen width or
            zooming out in your browser of choice.
          </Info>
        </InfoMessage>
      ) : (
        <Flex>
          <Button
            onClick={() => setLoginType("user")}
            aria-label="Login with MAL Account"
          >
            Login with <MALLogoImg src={MALLogo} alt="MAL" />
          </Button>
          <Button
            onClick={() => setLoginType("guest")}
            aria-label="Login as a Guest"
          >
            <span>Try as a Guest</span>
          </Button>
        </Flex>
      )}
    </Wrapper>
  );
};
