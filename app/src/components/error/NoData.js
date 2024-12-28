import { h } from "preact";
import styled from "styled-components";
import { HiOutlineExternalLink } from "react-icons/hi";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 1350px) {
    width: 90%;
  }
`;

const Link = styled.a`
  font-size: 1.5rem;
  display: flex;
  align-items: center;

  color: white;
  text-decoration: none;

  &:hover,
  :focus-visible {
    text-decoration: underline;
  }

  & svg {
    margin-left: 7px;
    font-size: 1rem;
  }
`;

export const NoData = ({ startCategory }) => {
  return (
    <Wrapper>
      <span style={{ fontSize: "5rem", marginBottom: "30px" }}>😱</span>
      <span style={{ fontSize: "2rem", marginBottom: "5px" }}>
        It looks like you haven't{" "}
        {startCategory === "manga" ? "read any manga" : "watched any anime"}{" "}
        yet.
      </span>
      <Link
        href={`https://myanimelist.net/top${startCategory}.php`}
        target="_blank"
        rel="noreferrer"
      >
        Get started <HiOutlineExternalLink />
      </Link>
    </Wrapper>
  );
};
