import { h } from "preact";
import styled from "styled-components";

const Shimmer = styled.div`
  width: 100px;
  height: 40px;
  border-radius: 5px;
  /* opacity: 0.5; */
`;

export const TimeWatched = ({ time }) => {
  return <Shimmer className="shimmer" />;
};
