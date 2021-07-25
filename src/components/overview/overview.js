import { h } from "preact";
import { useQuery } from "../../hooks";
import styled from "styled-components";
import dayjs from "dayjs";

import MALLogo from "../../assets/branding/mal.svg";
import MALLogoText from "../../assets/branding/mal-text.svg";
import MALChord from "../../assets/branding/mal-chord.svg";
import { useEffect, useState } from "preact/hooks";
import { TimeWatched } from "./timeWatched";

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
  justify-content: space-between;
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

const getTimeWatched = (anime) => {
  let days, hours, minutes, seconds;

  if (anime) {
    const secondsWatched = anime
      .map((anime) => {
        const info = anime.node;
        const duration = info.average_episode_duration;
        let epsWatched = info.my_list_status.num_episodes_watched;

        if (info.my_list_status.is_rewatching)
          epsWatched +=
            info.num_episodes * (info.my_list_status.num_times_rewatched + 1);

        return duration * epsWatched;
      })
      .reduce((total, anime) => total + anime, 0);

    days = Math.floor(secondsWatched / (60 * 60 * 24));
    hours = Math.floor((secondsWatched % (60 * 60 * 24)) / (60 * 60));
    minutes = Math.floor((secondsWatched % (60 * 60)) / 60);
    seconds = Math.floor(secondsWatched % 60);
  }

  return { days, hours, minutes, seconds };
};

export const Overview = ({ data }) => {
  const userDetails = useQuery("user_details");

  const [timeWatched, setTimeWatched] = useState({});

  useEffect(() => {
    setTimeWatched(getTimeWatched(data?.data));
  }, [data]);

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
      {userDetails ? (
        <RightWrapper>
          <RightWrapper>
            <Line fs={2} mb={5}>
              {userDetails.name}
            </Line>
            <Line fs={1} fw={300} mb={20}>
              Member since{" "}
              <Line fw={500}>
                {dayjs(userDetails["joined_at"]).format("DD/MM/YYYY")}
              </Line>
            </Line>
          </RightWrapper>
          <RightWrapper>
            <Line fs={1.5} mb={5}>
              Time watched 🕒
            </Line>
            <TimeWatched time={timeWatched} />
          </RightWrapper>
        </RightWrapper>
      ) : (
        <div>Loading</div>
      )}
    </Wrapper>
  );
};
