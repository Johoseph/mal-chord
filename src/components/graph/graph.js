import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import useResizeObserver from "use-resize-observer";

import { Sankey } from "./Sankey";
import { SankeyControls } from "./SankeyControls";
import { getSankeyFormat } from "./sankeyFunctions";

const NODE_SIDE = 40;
const NODE_PADDING = 10;

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

  const { dataNodes, dataLinks, nodeCount, nodeDifference } = getSankeyFormat(
    data || [],
    startSort,
    endSort,
    endCategory
  );

  useEffect(() => {
    setHeight(
      Math.max(0, (nodeCount || 0) * (NODE_SIDE + NODE_PADDING) - NODE_PADDING)
    );
  }, [nodeCount]);

  return (
    <div ref={ref}>
      {data ? (
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
      ) : (
        <div>Controls Loading</div>
      )}
      {data ? (
        <Sankey
          dataNodes={dataNodes}
          dataLinks={dataLinks}
          dimensions={{ width, height }}
          nodeSide={NODE_SIDE}
          nodePadding={NODE_PADDING}
          endNodeModifier={
            // Catering for nodePadding
            (nodeDifference * NODE_PADDING) / dataLinks.length -
            // Catering for more links than nodes
            ((dataLinks.length - nodeCount) * NODE_SIDE) / dataLinks.length
          }
        />
      ) : (
        <div>Sankey Loading</div>
      )}
    </div>
  );
};
