import { h } from "preact";
import styled from "styled-components";
import { useQuery } from "../../hooks";
import dayjs from "dayjs";

import { TimeWatched } from "./TimeWatched";
import { UserDetailsError } from "../error/UserDetailsError";
import { HiOutlineExternalLink } from "react-icons/hi";
import SailorMoon from "../../assets/ornamental/sailor-moon.svg";

const Wrapper = styled.div`
  display: flex;

  ${(props) =>
    props.compressed &&
    `
    align-items: center;
  `}
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;

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

const Shimmer = styled.div`
  width: ${(props) => (props.w ? props.w : "100")}px;
  height: ${(props) => (props.h ? props.h : "1")}rem;
  border-radius: ${(props) => (props.h ? props.h : "1")}rem;
  margin: 2px 0px 5px 5px;
`;

const Line = styled.span`
  display: flex;
  white-space: pre-wrap;
  font-size: ${(props) => (props.fs ? props.fs : 1)}rem;
  ${(props) =>
    props.fw &&
    `
    font-weight: ${props.fw};
  `}

  ${(props) =>
    props.mb &&
    `
    margin-bottom: ${props.mb}px;
  `}
`;

const AnimeSvg = styled.img`
  border-radius: 5px;
  width: ${(props) => (props.compressed ? 3 : 4)}rem;
  margin-left: 10px;
`;

const ImgShimmer = styled.div`
  width: ${(props) => (props.compressed ? 3 : 4)}rem;
  height: ${(props) => (props.compressed ? 3 : 4)}rem;
  border-radius: 100%;
  margin-left: 10px;
`;

export const UserDetails = ({ compressed = false, timeWatched = {} }) => {
  const { data, status, refetch } = useQuery("user_details");

  return (
    <>
      {status !== "error" ? (
        <Wrapper compressed={compressed}>
          <Flex>
            {data ? (
              <Line fs={2} mb={5}>
                <Link
                  href={`https://myanimelist.net/profile/${data.name}`}
                  target="_blank"
                >
                  {data.name}
                  <LinkIcon />
                </Link>
              </Line>
            ) : (
              <Shimmer h={2.2} w={150} className="shimmer" />
            )}
            {!compressed && (
              <Line fs={1} fw={300}>
                Member since{" "}
                {data ? (
                  <Line fw={500}>
                    {dayjs(data.memberSince).format("DD/MM/YYYY")}
                  </Line>
                ) : (
                  <Shimmer w={80} className="shimmer" />
                )}
              </Line>
            )}
          </Flex>
          {data ? (
            <AnimeSvg
              src={data.userImage ?? SailorMoon}
              compressed={compressed}
            />
          ) : (
            <ImgShimmer className="shimmer" compressed={compressed} />
          )}
        </Wrapper>
      ) : (
        <UserDetailsError refetch={refetch} />
      )}
      {!compressed && <TimeWatched time={timeWatched} />}
    </>
  );
};
