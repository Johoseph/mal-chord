import { h } from "preact";

import { useQuery } from "../hooks";
import { Overview } from "./overview";
import { Graph } from "./graph";

const LoggedIn = () => {
  const data = useQuery("user_anime_list");

  return (
    <main>
      <Overview data={data} />
      <Graph data={data} />
    </main>
  );
};

export default LoggedIn;
