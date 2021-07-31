import { h } from "preact";

import { useQuery } from "../hooks";
import { Overview } from "./overview/Overview";
import { Graph } from "./graph/Graph";

export const LoggedIn = () => {
  const data = useQuery("user_anime_list");

  return (
    <main>
      <Overview data={data} />
      <Graph data={data} />
    </main>
  );
};

export default LoggedIn;
