import {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "preact/hooks";

import {
  Tooltip,
  NodeCard,
  ContextMenu,
  PrintingModal,
  ColourPicker,
} from "components";
import { handleSankeySvg, checkCustomColour } from "helpers";

export const Sankey = ({
  sankeyState,
  updateSankey,
  dataNodes,
  dataLinks,
  dimensions: { width, height },
  nodeSide = 50,
  nodePadding = 50,
  nodeDifference,
  nodeCount,
  isPrinting,
  setIsPrinting,
  userName,
}) => {
  let sankeyRef = useRef();

  const [animeTooltip, setAnimeTooltip] = useState();
  const [contextTooltip, setContextTooltip] = useState();
  const [colourPicker, setColourPicker] = useState();
  const widthModifier = useMemo(() => width / 20, [width]);

  const openColourPicker = useCallback(() => {
    const toSet = contextTooltip;

    setContextTooltip();
    setColourPicker({
      x: toSet.x,
      y: toSet.y,
      name: toSet.title,
      colour: checkCustomColour(toSet.title, sankeyState.nodeColours),
    });
  }, [contextTooltip, sankeyState.nodeColours]);

  const handleNodeClick = useCallback((e, node) => {
    setContextTooltip(undefined);
    setColourPicker(undefined);

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
    setColourPicker(undefined);

    setContextTooltip({
      links: [
        ...node.sourceLinks.map(
          (link) => `${link.source.name}|${link.target.name}`
        ),
        ...node.targetLinks.map(
          (link) => `${link.source.name}|${link.target.name}`
        ),
      ],
      title: node.name,
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

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
        highlightedLinks: sankeyState.highlightedLinks,
        hiddenLinks: sankeyState.hiddenLinks,
        nodeColours: sankeyState.nodeColours,
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
      sankeyState.highlightedLinks,
      sankeyState.hiddenLinks,
      nodeCount,
      nodeDifference,
      sankeyState.nodeColours,
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
          <NodeCard
            node={animeTooltip.data}
            startCategory={sankeyState.startCategory}
            nodeColours={sankeyState.nodeColours}
          />
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
            sankeyState={sankeyState}
            updateSankey={updateSankey}
            openColourPicker={openColourPicker}
            removeMenu={() => setContextTooltip(undefined)}
          />
        </Tooltip>
      )}
      {colourPicker && (
        <Tooltip
          x={colourPicker.x}
          y={colourPicker.y}
          removeFn={() => {
            updateSankey({ type: "revertColour" });
            setColourPicker(undefined);
          }}
        >
          <ColourPicker
            colour={colourPicker}
            updateSankey={updateSankey}
            removeMenu={() => setColourPicker(undefined)}
          />
        </Tooltip>
      )}
      <PrintingModal
        isPrinting={isPrinting}
        setIsPrinting={setIsPrinting}
        sankeyState={sankeyState}
        defaultNode={{ nodeSide, nodePadding }}
        dataNodes={dataNodes}
        dataLinks={dataLinks}
        nodeCount={nodeCount}
        nodeDifference={nodeDifference}
        userName={userName}
      />
    </>
  );
};
