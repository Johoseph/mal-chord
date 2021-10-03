import { h } from "preact";
import { useEffect, useState, useMemo } from "preact/hooks";
import useResizeObserver from "use-resize-observer";

import { HistoryContext } from "contexts";
import { mathClamp, getSankeyFormat } from "helpers";
import { useSankeyHistory } from "hooks";
import {
  Sankey,
  SankeyControls,
  GraphError,
  NoData,
  GraphLoading,
  MoreData,
} from "components";

const DEFAULT_LIMIT = 25;

const LIST_STATUS = {
  anime: ["Completed", "Watching", "On Hold", "Dropped", "Plan To Watch"],
  manga: ["Completed", "Reading", "On Hold", "Dropped", "Plan To Read"],
};

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
  const [isPrinting, setIsPrinting] = useState(false);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [nodeFilter, setNodeFilter] = useState(
    LIST_STATUS[startCategory].map((status) => ({ name: status, active: true }))
  );

  const filteredData = useMemo(
    () =>
      data
        ? data.filter(
            (item) =>
              nodeFilter.find((filter) => filter.name === item.status).active
          )
        : undefined,
    [data, nodeFilter]
  );

  const { dataNodes, dataLinks, nodeCount, nodeDifference } = getSankeyFormat(
    filteredData || [],
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
    if (filteredData) setLimit(Math.min(filteredData.length, DEFAULT_LIMIT));
  }, [filteredData]);

  useEffect(() => {
    setHeight(
      Math.max(0, (nodeCount || 0) * (nodeSide + nodePadding) - nodePadding)
    );
  }, [nodeCount, nodePadding, nodeSide]);

  // Reinitialise nodeFilter when startCategory changes
  useEffect(
    () =>
      setNodeFilter(
        LIST_STATUS[startCategory].map((status) => ({
          name: status,
          active: true,
        }))
      ),
    [startCategory]
  );

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
            setIsPrinting={setIsPrinting}
            count={filteredData.length}
            limit={limit}
            setLimit={setLimit}
          />
          {filteredData.length > 0 ? (
            <Sankey
              startCategory={startCategory}
              endCategory={endCategory}
              dataNodes={dataNodes}
              dataLinks={dataLinks}
              dimensions={{ width, height }}
              nodeSide={nodeSide}
              nodePadding={nodePadding}
              nodeDifference={nodeDifference}
              nodeCount={nodeCount}
              isPrinting={isPrinting}
              setIsPrinting={setIsPrinting}
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
