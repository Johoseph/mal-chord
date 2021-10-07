import { h } from "preact";
import styled from "styled-components";

import {
  UserDetails,
  ScrollOverview,
  MALChord,
  TimeWatched,
  MangaCompletion,
} from "components";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto 40px auto;

  @media (max-width: 1350px) {
    width: 90%;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

export const Overview = ({
  data,
  status,
  startCategory,
  useMock,
  userData,
  userStatus,
  userRefetch,
}) => {
  const noData = status === "success" && data.length === 0;

  return (
    <Wrapper>
      <ScrollOverview
        data={userData}
        status={userStatus}
        refetch={userRefetch}
        useMock={useMock}
      />
      <MALChord isLink={true} />
      <RightWrapper className="hlp-2">
        <UserDetails
          data={userData}
          status={userStatus}
          refetch={userRefetch}
          useMock={useMock}
        />
        {!noData && startCategory === "anime" && (
          <TimeWatched data={data} status={status} />
        )}
        {!noData && startCategory === "manga" && (
          <MangaCompletion data={data} status={status} />
        )}
      </RightWrapper>
    </Wrapper>
  );
};
