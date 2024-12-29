import { useEffect, useState } from "preact/hooks";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    top: -20px;
  }
  to {
    opacity: 1;
    top: 0;
  }
`;

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  background: #1f1f1f;
  border: 2px solid #2e51a2;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 30px;

  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.div`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const Info = styled.div`
  font-weight: 300;
`;

const FetchMore = styled.button`
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  padding: 0;

  &:hover,
  :focus-visible {
    text-decoration: underline;
  }
`;

export const MoreData = ({ startCategory, fetchMore }) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let timeout = setTimeout(() => setShouldShow(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (shouldShow)
    return (
      <Wrapper>
        <Title>Slow down Space Cowboy! 🤠</Title>
        <Info>
          You have{" "}
          {startCategory === "manga" ? "read more Manga" : "watched more Anime"}{" "}
          than currently shown in the chart. Would you like to{" "}
          <FetchMore onClick={fetchMore}>fetch more?</FetchMore>
        </Info>
      </Wrapper>
    );
};
