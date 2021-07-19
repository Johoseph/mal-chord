import { h } from "preact";
import { useQuery } from "../../hooks";
import styled from "styled-components";

import MALLogo from "../../assets/branding/mal.svg";
import MALLogoText from "../../assets/branding/mal-text.svg";
import MALChord from "../../assets/branding/mal-chord.svg";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  height: 12em;
`;

const LeftWrapper = styled.div`
  display: flex;
`;

const RightWrapper = styled.div`
  display: flex;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LineOne = styled.span`
  font-size: 2rem;
`;

const LineTwo = styled.span`
  display: flex;
  align-content: center;
`;

const LineThree = styled.span`
  font-size: 1.2rem;
  font-weight: 100;
`;

const Logo = styled.div`
  background-color: #2e51a2;
  width: 12em;
  height: 12em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
`;

const MAL = styled.img`
  width: 75%;
  margin-bottom: 5px;
`;

const Chord = styled.img`
  width: 6em;
`;

const MALText = styled.img`
  height: 5.5em;
`;

export const Overview = () => {
  const data = useQuery("user_details");

  console.log(data);

  return (
    <Wrapper>
      <LeftWrapper>
        <Logo>
          <MAL src={MALLogo} />
          <Chord src={MALChord} />
        </Logo>
        <TextWrap>
          <LineOne>graph your</LineOne>
          <LineTwo>
            <MALText src={MALLogoText} />
          </LineTwo>
          <LineThree>
            A chord diagram introspection of your MyAnimeList library 📈
          </LineThree>
        </TextWrap>
      </LeftWrapper>
      <RightWrapper>
        {data ? <div>User Details</div> : <div>Loading</div>}
      </RightWrapper>
    </Wrapper>
  );
};
