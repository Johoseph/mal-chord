import { h } from "preact";
import styled from "styled-components";
import { useQuery } from "../../hooks";
import dayjs from "dayjs";

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
  white-space: nowrap;
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

${(props) =>
    props.ml &&
    `
    margin-left: ${props.ml}px;
  `}
`;

const AnimeSvg = styled.img`
  border-radius: 5px;
  width: ${(props) => (props.compressed ? 3 : 4)}rem;
  height: ${(props) => (props.compressed ? 3 : 4)}rem;
  margin-left: 15px;
  object-fit: cover;
  object-position: top;
`;

const ImgShimmer = styled.div`
  width: ${(props) => (props.compressed ? 3 : 4)}rem;
  height: ${(props) => (props.compressed ? 3 : 4)}rem;
  border-radius: 100%;
  margin-left: 10px;
`;

export const UserDetails = ({ compressed = false, useMock }) => {
  const { data, status, refetch } = useQuery(
    useMock ? "mock_details" : "user_details"
  );

  return (
    <>
      {status !== "error" ? (
        <Wrapper compressed={compressed}>
          <Flex>
            {data ? (
              <Line fs={2} mb={compressed ? 0 : 5}>
                {!useMock ? (
                  <Link
                    href={`https://myanimelist.net/profile/${data.name}`}
                    target="_blank"
                  >
                    {data.name}
                    <LinkIcon />
                  </Link>
                ) : (
                  data.name
                )}
              </Line>
            ) : (
              <Shimmer h={2.2} w={150} className="shimmer" />
            )}
            {!compressed && (
              <Line fs={1} fw={300}>
                Member since
                {data ? (
                  <Line fw={500} ml={5}>
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
              alt="User profile picture"
            />
          ) : (
            <ImgShimmer className="shimmer" compressed={compressed} />
          )}
        </Wrapper>
      ) : (
        <UserDetailsError refetch={refetch} />
      )}
    </>
  );
};
