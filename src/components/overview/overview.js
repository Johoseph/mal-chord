import { h } from "preact";
import styled from "styled-components";
import { useEffect, useState } from "preact/hooks";

import { UserDetails } from "./UserDetails";
import { ScrollOverview } from "./ScrollOverview";
import { MALChord } from "../general/MALChord";

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

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
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

export const Overview = ({ data, status, useMock = false }) => {
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
      <ScrollOverview useMock={useMock} />
      <MALChord isLink={true} />
      <RightWrapper className="hlp-2">
        <UserDetails timeWatched={timeWatched} useMock={useMock} />
      </RightWrapper>
    </Wrapper>
  );
};
