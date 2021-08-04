import { h } from "preact";
import { useMemo } from "preact/hooks";
import styled from "styled-components";
import { titleCase } from "../../helpers";

const Wrapper = styled.div`
  display: flex;
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

  return (
    <Wrapper>
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
    </Wrapper>
  );
};
