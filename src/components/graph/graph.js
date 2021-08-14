import { h } from "preact";
import { useEffect, useState, useMemo } from "preact/hooks";
import useResizeObserver from "use-resize-observer";
import { HistoryContext } from "../../contexts";
import { mathClamp } from "../../helpers";
import { useSankeyHistory } from "../../hooks";
import { GraphError } from "../error/GraphError";
import { GraphLoading } from "./loading/GraphLoading";
import { MoreData } from "./MoreData";

import { Sankey } from "./Sankey";
import { SankeyControls } from "./SankeyControls";
import { getSankeyFormat } from "./sankeyFunctions";

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

export const Graph = ({
  data,
  status,
  refetch,
  hasNextPage,
  helpActive,
  setHelpRequired,
}) => {
  const { currentIndex, setCurrentIndex, sankeyHistory, writeToHistory } =
    useSankeyHistory();

  const historyContext = useMemo(
    () => ({
      currentIndex,
      setCurrentIndex,
      sankeyHistory,
      writeToHistory,
      setHelpRequired,
    }),
    [
      currentIndex,
      setCurrentIndex,
      sankeyHistory,
      writeToHistory,
      setHelpRequired,
    ]
  );

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
  const [limit, setLimit] = useState(100);

  const { dataNodes, dataLinks, nodeCount, nodeDifference } = getSankeyFormat(
    data || [],
    startSort,
    endSort,
    endCategory,
    limit
  );

  const nodeSide = useMemo(
    () => Math.round(mathClamp((nodeCount - 75) / -1.4, 10, 40)),
    [nodeCount]
  );

  const nodePadding = useMemo(
    () => Math.round(mathClamp((nodeCount - 100) / -8, 5, 10)),
    [nodeCount]
  );

  useEffect(() => {
    if (data) setLimit(Math.min(data.length, 100));
  }, [data]);

  useEffect(() => {
    setHeight(
      Math.max(0, (nodeCount || 0) * (nodeSide + nodePadding) - nodePadding)
    );
  }, [nodeCount, nodePadding, nodeSide]);

  return (
    <div ref={ref}>
      {status === "success" && (
        <HistoryContext.Provider value={historyContext}>
          {hasNextPage && !helpActive && (
            <MoreData fetchMore={() => refetch({ getNextPage: true })} />
          )}
          <SankeyControls
            setStartSort={setStartSort}
            setEndSort={setEndSort}
            setEndCategory={setEndCategory}
            startSort={startSort}
            endSort={endSort}
            endCategory={endCategory}
            categoryOptions={endCategories}
            sortOptions={sortOptions}
            count={data.length}
            limit={limit}
            setLimit={setLimit}
          />
          <Sankey
            endCategory={endCategory}
            dataNodes={dataNodes}
            dataLinks={dataLinks}
            dimensions={{ width, height }}
            nodeSide={nodeSide}
            nodePadding={nodePadding}
            endNodeModifier={
              // Catering for nodePadding
              (nodeDifference * nodePadding) / dataLinks.length -
              // Catering for more links than nodes
              ((dataLinks.length - nodeCount) * nodeSide) / dataLinks.length
            }
          />
        </HistoryContext.Provider>
      )}
      {status === "loading" && <GraphLoading />}
      {status === "error" && <GraphError refetch={refetch} />}
    </div>
  );
};
