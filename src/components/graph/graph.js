import { h } from "preact";
import { useQuery } from "../../hooks";

export const Graph = () => {
  const data = useQuery("user_anime_list");

  console.log(data);

  return (
    <div class="graph">{data ? <div>Graph</div> : <div>Also Loading</div>}</div>
  );
};
