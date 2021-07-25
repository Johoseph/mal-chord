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
  margin-left: 30px;
`;

const Unit = styled.span`
  font-size: 0.9rem;
  font-weight: 300;
  text-align: end;
`;

const Value = styled.span`
  font-size: 2.5rem;
  text-align: end;
`;

const Shimmer = styled.div`
  width: 100px;
  height: 40px;
  border-radius: 5px;
  /* opacity: 0.5; */
`;

export const TimeWatched = ({ time }) => {
  const loading = useMemo(
    () => Object.values(time).filter((e) => e).length === 0,
    [time]
  );

  return (
    <Wrapper>
      {Object.keys(time).map((unit, i) => (
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
