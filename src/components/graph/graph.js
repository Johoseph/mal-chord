import { h } from "preact";
import { useEffect, useState, useMemo } from "preact/hooks";
import useResizeObserver from "use-resize-observer";

import { mathClamp, getSankeyFormat } from "helpers";
import {
  Sankey,
  SankeyControls,
  GraphError,
  NoData,
  GraphLoading,
  MoreData,
} from "components";

export const Graph = ({
  sankeyState,
  updateSankey,
  status,
  refetch,
  hasNextPage,
  helpActive,
  setHelpRequired,
}) => {
  const { ref, width } = useResizeObserver();
  const [height, setHeight] = useState(100);

  const [isPrinting, setIsPrinting] = useState(false);

  const { dataNodes, dataLinks, nodeCount, nodeDifference } = getSankeyFormat(
    sankeyState.filteredData,
    sankeyState.startSort,
    sankeyState.endSort,
    sankeyState.endCategory,
    sankeyState.nodeLimit
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
    setHeight(
      Math.max(0, (nodeCount || 0) * (nodeSide + nodePadding) - nodePadding)
    );
  }, [nodeCount, nodePadding, nodeSide]);

  return (
    <div ref={ref}>
      {status === "success" && (
        <>
          {hasNextPage && !helpActive && (
            <MoreData
              startCategory={sankeyState.startCategory}
              fetchMore={() => refetch({ getNextPage: true })}
            />
          )}
          <SankeyControls
            sankeyState={sankeyState}
            updateSankey={updateSankey}
            setIsPrinting={setIsPrinting}
            setHelpRequired={setHelpRequired}
          />
          {sankeyState.filteredData.length > 0 ? (
            <Sankey
              startCategory={sankeyState.startCategory}
              endCategory={sankeyState.endCategory}
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
            <NoData startCategory={sankeyState.startCategory} />
          )}
        </>
      )}
      {status === "loading" && <GraphLoading />}
      {status === "error" && <GraphError refetch={refetch} />}
    </div>
  );
};
