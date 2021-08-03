import { h } from "preact";
import styled, { css } from "styled-components";
import { HiOutlineExternalLink } from "react-icons/hi";
import { getNodeColour } from "../sankeyFunctions";

const Wrapper = styled.div`
  display: flex;
  min-width: 250px;
  max-width: 500px;
`;

const NodeItem = styled.div`
  display: flex;
  align-items: center;
  font-weight: 300;
  margin-bottom: 2px;
`;

const Color = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 100%;
  background: ${(props) => props.nodeColour};
  margin-right: 10px;
`;

const Photo = styled.img`
  width: 10rem;
  margin-right: 20px;
`;

const Data = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleStyle = css`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 15px;
`;

const Title = styled.div`
  ${TitleStyle}
`;

const Link = styled.a`
  ${TitleStyle}
  text-decoration: none;

  &:hover,
  :focus-visible {
    text-decoration: underline;
  }
`;

const LinkIcon = styled(HiOutlineExternalLink)`
  font-size: 1rem;
  margin-left: 5px;
  color: #dadada;
`;

export const NodeCard = ({ node }) => {
  return (
    <Wrapper>
      {node.photo && <Photo src={node.photo} alt={`${node.title} cover art`} />}
      <Data>
        {node.id ? (
          <Link
            href={`https://myanimelist.net/anime/${node.id}`}
            target="_blank"
          >
            {node.title}
            <LinkIcon />
          </Link>
        ) : (
          <Title>{node.title}</Title>
        )}
        {node.sourceLinks.length > 0 && (
          <Data>
            <span style={{ marginBottom: "10px" }}>Links To</span>
            {node.sourceLinks.map((source) => (
              <NodeItem key={source.target.node}>
                <Color nodeColour={getNodeColour(source.target.name)} />
                {source.target.name}
              </NodeItem>
            ))}
          </Data>
        )}
        {node.targetLinks.length > 0 && (
          <Data>
            <span style={{ marginBottom: "10px" }}>Links From</span>
            {node.targetLinks.map((target) => (
              <NodeItem key={target.source.node}>
                <Color nodeColour={getNodeColour(target.source.name)} />
                {target.source.name}
              </NodeItem>
            ))}
          </Data>
        )}
      </Data>
    </Wrapper>
  );
};
