import { h } from "preact";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto 20px auto;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 5px;
  margin-bottom: 10px;
`;

const Flex = styled.div`
  display: flex;
`;

const Shimmer = styled.div`
  width: ${(props) => props.w ?? 100}px;
  height: ${(props) => props.h ?? 24}px;
  border-radius: 9999px;
  margin: 2px 0px 5px 5px;
`;

export const SankeyControlsLoading = () => {
  return (
    <Wrapper>
      <Row>
        <Shimmer className="shimmer" w={150} h={30} />
        <Shimmer className="shimmer" w={150} h={30} />
      </Row>
      <Row>
        <Flex>
          <Shimmer className="shimmer" w={24} h={24} />
          <Shimmer className="shimmer" />
        </Flex>
        <Flex>
          <Shimmer className="shimmer" w={24} h={24} />
          <Shimmer className="shimmer" />
        </Flex>
      </Row>
    </Wrapper>
  );
};
