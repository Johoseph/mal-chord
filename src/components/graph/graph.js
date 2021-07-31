import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import useResizeObserver from "use-resize-observer";

import { Sankey } from "./Sankey";
import { SankeyControls } from "./SankeyControls";
import { getSankeyFormat } from "./sankeyFunctions";

const HEIGHT_MULTIPLIER = 40;

const endCategories = [
  {
    value: "rating",
    label: "anime rating",
  },
  {
    value: "genre",
    label: "genre",
  },
  {
    value: "studio",
    label: "studio",
  },
  {
    value: "status",
    label: "your list status",
  },
  {
    value: "score",
    label: "your score",
  },
];

const sortOptions = [
  {
    value: "alphabetical",
    label: "alphabetical",
  },
  {
    value: "date",
    label: "last updated",
  },
  {
    value: "popularity",
    label: "popularity",
  },
  {
    value: "ranking",
    label: "ranking",
  },
  {
    value: "score",
    label: "your score",
  },
];

export const Graph = ({ data }) => {
  const { ref, width } = useResizeObserver();
  const [height, setHeight] = useState(100);

  const [startSort, setStartSort] = useState({
    type: "date",
    direction: "DESC",
  });
  const [endSort, setEndSort] = useState({
    type: "alphabetical",
    direction: "DESC",
  });
  const [endCategory, setEndCategory] = useState("score");

  const { dataNodes, dataLinks, nodeCount } = getSankeyFormat(
    data || [],
    startSort,
    endSort,
    endCategory
  );

  useEffect(() => {
    setHeight((nodeCount || 0) * HEIGHT_MULTIPLIER);
  }, [nodeCount]);

  console.log({ data, dataNodes, dataLinks, nodeCount });

  return (
    <div ref={ref}>
      {data ? (
        <>
          <SankeyControls
            setStartSort={setStartSort}
            setEndSort={setEndSort}
            setEndCategory={setEndCategory}
            startSort={startSort}
            endSort={endSort}
            endCategory={endCategory}
            categoryOptions={endCategories}
            sortOptions={sortOptions}
          />
          <Sankey
            dataNodes={dataNodes}
            dataLinks={dataLinks}
            dimensions={{ width, height }}
          />
        </>
      ) : (
        <div>Sankey Loading</div>
      )}
    </div>
  );
};
