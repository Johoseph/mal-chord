import { h } from "preact";
import { useMemo, useEffect, useState } from "preact/hooks";
import styled from "styled-components";
import { decode } from "he";

import { titleCase } from "../../helpers";

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

export const TimeWatched = ({ time }) => {
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
