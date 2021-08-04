import { h } from "preact";
import { useQuery } from "../../hooks";
import styled from "styled-components";
import dayjs from "dayjs";
import { decode } from "he";

import MALLogo from "../../assets/branding/mal.svg";
import MALLogoText from "../../assets/branding/mal-text.svg";
import MALChord from "../../assets/branding/mal-chord.svg";
import { UserDetailsError } from "../error/UserDetailsError";
import { useEffect, useState } from "preact/hooks";
import { TimeWatched } from "./TimeWatched";

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

const Shimmer = styled.div`
  width: ${(props) => (props.w ? props.w : "100")}px;
  height: ${(props) => (props.h ? props.h : "1")}rem;
  border-radius: ${(props) => (props.h ? props.h : "1")}rem;
  margin: 2px 0px 5px 5px;
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
  const {
    data: userDetails,
    status: userDetailsStatus,
    refetch,
  } = useQuery("user_details");

  const [timeWatched, setTimeWatched] = useState({});
  const [clock, setClock] = useState("&#128347;");

  useEffect(() => {
    if (status !== "error") {
      setTimeWatched(getTimeWatched(data));
    } else {
      setTimeWatched({ days: "😫", hours: "😭", minutes: "😴", seconds: "😖" });
    }
  }, [data, status]);

  useEffect(() => {
    let clockInterval = setInterval(
      () =>
        setClock(
          (prev) =>
            `${prev.substring(0, 6)}${
              prev.substring(6, 8) === "47"
                ? "36"
                : parseInt(prev.substring(6, 8), 10) + 1
            };`
        ),
      150
    );
    return () => clearInterval(clockInterval);
  }, []);

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
      <RightWrapper>
        {userDetailsStatus !== "error" ? (
          <RightWrapper>
            {userDetails ? (
              <Line fs={2} mb={5}>
                {userDetails.name}
              </Line>
            ) : (
              <Shimmer h={2.2} w={150} className="shimmer" />
            )}
            <Line fs={1} fw={300} mb={20}>
              Member since{" "}
              {userDetails ? (
                <Line fw={500}>
                  {dayjs(userDetails["joined_at"]).format("DD/MM/YYYY")}
                </Line>
              ) : (
                <Shimmer w={80} className="shimmer" />
              )}
            </Line>
          </RightWrapper>
        ) : (
          <UserDetailsError refetch={refetch} />
        )}
        <RightWrapper>
          <Line fs={1.5} mb={10}>
            Time watched {decode(clock)}
          </Line>
          <TimeWatched time={timeWatched} />
        </RightWrapper>
      </RightWrapper>
    </Wrapper>
  );
};
