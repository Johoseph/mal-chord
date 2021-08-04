import { h } from "preact";

import { useQuery } from "../hooks";
import { Overview } from "./overview/Overview";
import { Graph } from "./graph/Graph";

export const LoggedIn = () => {
  const { data, status } = useQuery("user_anime_list");

  return (
    <main>
      <Overview data={data} status={status} />
      <Graph data={data} status={status} />
    </main>
  );
};

export default LoggedIn;
