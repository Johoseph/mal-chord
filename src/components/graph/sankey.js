import { h } from "preact";
import {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "preact/hooks";

import { Tooltip, NodeCard, ContextMenu, PrintingModal } from "components";
import { handleSankeySvg } from "helpers";

export const Sankey = ({
  startCategory,
  endCategory,
  dataNodes,
  dataLinks,
  dimensions: { width, height },
  nodeSide = 50,
  nodePadding = 50,
  nodeDifference,
  nodeCount,
  isPrinting,
  setIsPrinting,
}) => {
  let sankeyRef = useRef();

  const [highlightedLinks, setHighlightedLinks] = useState([]);
  const [hiddenLinks, setHiddenLinks] = useState([]);

  const [animeTooltip, setAnimeTooltip] = useState();
  const [contextTooltip, setContextTooltip] = useState();
  const widthModifier = useMemo(() => width / 20, [width]);

  const handleNodeClick = useCallback((e, node) => {
    setContextTooltip(undefined);

    setAnimeTooltip({
      data: {
        id: node.id,
        title: node.name,
        sourceLinks: node.sourceLinks,
        targetLinks: node.targetLinks,
        photo: node.photo,
      },
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  const handleNodeRightClick = useCallback((e, node) => {
    e.preventDefault();
    setAnimeTooltip(undefined);

    setContextTooltip({
      links: [
        ...node.sourceLinks.map(
          (link) => `${link.source.name}|${link.target.name}`
        ),
        ...node.targetLinks.map(
          (link) => `${link.source.name}|${link.target.name}`
        ),
      ],
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  useEffect(() => {
    setHighlightedLinks([]);
    setHiddenLinks([]);
  }, [startCategory, endCategory]);

  useEffect(
    () =>
      handleSankeySvg({
        element: sankeyRef.current,
        width,
        height,
        nodeSide,
        nodePadding,
        dataNodes,
        dataLinks,
        widthModifier,
        nodeCount,
        nodeDifference,
        handleNodeClick,
        handleNodeRightClick,
        highlightedLinks,
        hiddenLinks,
      }),
    [
      width,
      height,
      dataNodes,
      dataLinks,
      nodeSide,
      nodePadding,
      widthModifier,
      handleNodeClick,
      handleNodeRightClick,
      highlightedLinks,
      hiddenLinks,
      nodeCount,
      nodeDifference,
    ]
  );

  return (
    <>
      <div ref={sankeyRef} />
      {animeTooltip && (
        <Tooltip
          x={animeTooltip.x}
          y={animeTooltip.y}
          removeFn={() => setAnimeTooltip(undefined)}
        >
          <NodeCard node={animeTooltip.data} startCategory={startCategory} />
        </Tooltip>
      )}
      {contextTooltip && (
        <Tooltip
          x={contextTooltip.x}
          y={contextTooltip.y}
          removeFn={() => setContextTooltip(undefined)}
          pd={2}
        >
          <ContextMenu
            links={contextTooltip.links}
            highlightedLinks={highlightedLinks}
            setHighlightedLinks={setHighlightedLinks}
            hiddenLinks={hiddenLinks}
            setHiddenLinks={setHiddenLinks}
            removeMenu={() => setContextTooltip(undefined)}
          />
        </Tooltip>
      )}
      <PrintingModal
        isPrinting={isPrinting}
        setIsPrinting={setIsPrinting}
        defaultNode={{ nodeSide, nodePadding }}
        dataNodes={dataNodes}
        dataLinks={dataLinks}
        nodeCount={nodeCount}
        nodeDifference={nodeDifference}
        highlightedLinks={highlightedLinks}
        hiddenLinks={hiddenLinks}
      />
    </>
  );
};
