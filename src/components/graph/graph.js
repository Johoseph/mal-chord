import { h } from "preact";
import { useEffect, useState, useMemo } from "preact/hooks";
import useResizeObserver from "use-resize-observer";
import { HistoryContext } from "../../contexts";
import { mathClamp } from "../../helpers";
import { useSankeyHistory } from "../../hooks";
import { GraphError } from "../error/GraphError";
import { NoData } from "../error/NoData";
import { GraphLoading } from "./loading/GraphLoading";
import { MoreData } from "./MoreData";

import { Sankey } from "./Sankey";
import { SankeyControls } from "./SankeyControls";
import { getSankeyFormat } from "./sankeyFunctions";

const DEFAULT_LIMIT = 25;

export const Graph = ({
  data,
  status,
  refetch,
  hasNextPage,
  helpActive,
  setHelpRequired,
  startCategory,
  setStartCategory,
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
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

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
    if (data) setLimit(Math.min(data.length, DEFAULT_LIMIT));
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
            <MoreData
              startCategory={startCategory}
              fetchMore={() => refetch({ getNextPage: true })}
            />
          )}
          <SankeyControls
            startCategory={startCategory}
            setStartCategory={setStartCategory}
            setStartSort={setStartSort}
            setEndSort={setEndSort}
            setEndCategory={setEndCategory}
            startSort={startSort}
            endSort={endSort}
            endCategory={endCategory}
            count={data.length}
            limit={limit}
            setLimit={setLimit}
          />
          {data.length > 0 ? (
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
          ) : (
            <NoData startCategory={startCategory} />
          )}
        </HistoryContext.Provider>
      )}
      {status === "loading" && <GraphLoading />}
      {status === "error" && <GraphError refetch={refetch} />}
    </div>
  );
};
