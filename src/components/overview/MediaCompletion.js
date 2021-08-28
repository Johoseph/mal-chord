import { h } from "preact";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "preact/hooks";
import { decode } from "he";

import { titleCase, radixFormat } from "../../helpers";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const TimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const Unit = styled.span`
  font-size: 0.9rem;
  font-weight: 300;
  text-align: end;
`;

const Value = styled.span`
  font-size: 2.1rem;
  text-align: end;
`;

const Line = styled.span`
  display: flex;
  white-space: pre-wrap;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Shimmer = styled.div`
  width: 100%;
  height: 2.3rem;
  border-radius: 2.3rem;
  margin-top: 0.2rem;
`;

const getMangaCompletion = (manga) => {
  let mangaConsumption = {};

  if (manga) {
    mangaConsumption = manga.reduce(
      (total, _manga) => ({
        "Volumes Read": total["Volumes Read"] + _manga.volumesRead,
        "Chapters Read": total["Chapters Read"] + _manga.chaptersRead,
      }),
      { "Volumes Read": 0, "Chapters Read": 0 }
    );
  }

  return mangaConsumption;
};

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

export const MangaCompletion = ({ data, status }) => {
  const [completion, setCompletion] = useState({});

  useEffect(() => {
    if (status !== "error") {
      setCompletion(getMangaCompletion(data));
    } else {
      setCompletion({ "Volumes Read": "😫😖", "Chapters Read": "😭😴" });
    }
  }, [data, status]);

  const loading = useMemo(
    () => Object.values(completion).filter((e) => e).length === 0,
    [completion]
  );

  return (
    <Wrapper>
      <Line>Manga Completion 📚</Line>
      <div style={{ display: "flex" }}>
        {Object.keys(completion)
          .filter((unit) => completion[unit] !== 0)
          .map((unit, i) => (
            <TimeWrapper key={i}>
              <Unit>{titleCase(unit)}</Unit>
              {loading ? (
                <Shimmer className="shimmer" />
              ) : (
                <Value>{radixFormat(completion[unit])}</Value>
              )}
            </TimeWrapper>
          ))}
      </div>
    </Wrapper>
  );
};

export const TimeWatched = ({ data, status }) => {
  const [time, setTime] = useState({});

  useEffect(() => {
    if (status !== "error") {
      setTime(getTimeWatched(data));
    } else {
      setTime({ days: "😫", hours: "😭", minutes: "😴", seconds: "😖" });
    }
  }, [data, status]);

  const loading = useMemo(
    () => Object.values(time).filter((e) => e).length === 0,
    [time]
  );

  const [clock, setClock] = useState("&#128347;");

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
      <Line>Time watched {decode(clock)}</Line>
      <div style={{ display: "flex" }}>
        {Object.keys(time)
          .filter((unit) => time[unit] !== 0)
          .map((unit, i) => (
            <TimeWrapper key={i}>
              <Unit>{titleCase(unit)}</Unit>
              {loading ? (
                <Shimmer className="shimmer" />
              ) : (
                <Value>{time[unit]}</Value>
              )}
            </TimeWrapper>
          ))}
      </div>
    </Wrapper>
  );
};
