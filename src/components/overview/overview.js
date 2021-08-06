import { h } from "preact";
import styled from "styled-components";

import MALLogoText from "../../assets/branding/mal-text.svg";
import MALChord from "../../assets/branding/mal-chord.svg";
import { useEffect, useState } from "preact/hooks";
import { UserDetails } from "./UserDetails";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 12em;
  width: 80%;
  margin: 0 auto 40px auto;

  @media (max-width: 1000px) {
    width: 95%;
  }
`;

const LeftWrapper = styled.div`
  display: flex;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const TextWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Line = styled.span`
  display: flex;
  white-space: pre-wrap;
  font-size: ${(props) => (props.fs ? props.fs : 1)}rem;
  ${(props) =>
    props.fw &&
    `
    font-weight: ${props.fw};
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

const MALText = styled.img`
  height: 5.5em;
`;

const getTimeWatched = (anime) => {
  let days, hours, minutes, seconds;

  if (anime) {
    const secondsWatched = anime.reduce(
      (total, anime) => total + anime.secondsWatched,
      0
    );

    days = Math.floor(secondsWatched / (60 * 60 * 24));
    hours = Math.floor((secondsWatched % (60 * 60 * 24)) / (60 * 60));
    minutes = Math.floor((secondsWatched % (60 * 60)) / 60);
    seconds = Math.floor(secondsWatched % 60);
  }

  return { days, hours, minutes, seconds };
};

export const Overview = ({ data, status }) => {
  const [timeWatched, setTimeWatched] = useState({});

  useEffect(() => {
    if (status !== "error") {
      setTimeWatched(getTimeWatched(data));
    } else {
      setTimeWatched({ days: "😫", hours: "😭", minutes: "😴", seconds: "😖" });
    }
  }, [data, status]);

  return (
    <Wrapper>
      <LeftWrapper>
        <Logo>
          <img src={MALChord} style={{ width: "9rem" }} />
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
      <RightWrapper>
        <UserDetails timeWatched={timeWatched} />
      </RightWrapper>
    </Wrapper>
  );
};
