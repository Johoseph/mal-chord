import { h } from "preact";
import { useQuery } from "../../hooks";

export const Overview = () => {
  const data = useQuery("user_details");

  console.log(data);

  return <>{data ? <div>Overview</div> : <div>Loading</div>}</>;
};
