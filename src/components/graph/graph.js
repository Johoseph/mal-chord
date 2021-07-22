import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useQuery } from "../../hooks";
import { Sankey } from "./sankey";
import useResizeObserver from "use-resize-observer";

const HEIGHT_MULTIPLIER = 40;

export const Graph = () => {
  const data = useQuery("user_anime_list");
  const { ref, width } = useResizeObserver();

  const [height, setHeight] = useState(100);

  useEffect(() => {
    if (data) {
      console.log(data);
      setHeight((data.data?.length || 0) * HEIGHT_MULTIPLIER);
    }
  }, [data]);

  return (
    <div class="graph" ref={ref}>
      {data ? (
        <Sankey data={data} dimensions={{ width, height }} />
      ) : (
        <div>Sankey Loading</div>
      )}
    </div>
  );
};
