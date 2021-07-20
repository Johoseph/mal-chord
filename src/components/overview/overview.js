import { h } from "preact";
import { useQuery } from "../../hooks";
import styled from "styled-components";
import dayjs from "dayjs";

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
  flex-direction: column;
  align-items: flex-end;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Line = styled.span`
  font-size: ${(props) => (props.fs ? props.fs : 1)}rem;
  ${(props) =>
    props.fw &&
    `
    font-weight: ${props.fw};
  `}

  ${(props) =>
    props.mb &&
    `
    margin-bottom: ${props.mb}px;
  `}
`;

const LineTwo = styled.span`
  display: flex;
  align-content: center;
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
  border-radius: 10px;
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
          <Line fs={2}>graph your</Line>
          <LineTwo>
            <MALText src={MALLogoText} />
          </LineTwo>
          <Line fs={1.2} fw={300}>
            A chord diagram introspection of your MyAnimeList library 📈
          </Line>
        </TextWrap>
      </LeftWrapper>
      {data ? (
        <RightWrapper>
          <Line fs={2} mb={5}>
            {data.name}
          </Line>
          <Line fs={1} fw={300} mb={20}>
            Member since{" "}
            <Line fw={500}>
              {dayjs(data["joined_at"]).format("DD/MM/YYYY")}
            </Line>
          </Line>
          <Line fs={1.2}>
            Time watched
            <span id="time_portal">{}</span>
          </Line>
        </RightWrapper>
      ) : (
        <div>Loading</div>
      )}
    </Wrapper>
  );
};
