import { h } from "preact";
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
  const [nodeColours, setNodeColours] = useState([]);

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
      colour: checkCustomColour(toSet.title, nodeColours),
    });
  }, [contextTooltip, nodeColours]);

  const confirmColour = useCallback(
    (colour) => {
      setNodeColours((prev) => [
        ...prev.filter((col) => col.name !== colourPicker.title),
        { name: colourPicker.name, colour },
      ]);

      setColourPicker();
    },
    [colourPicker]
  );

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

  useEffect(() => {
    setHighlightedLinks([]);
    setHiddenLinks([]);
    setNodeColours([]);
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
        nodeColours,
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
      nodeColours,
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
            startCategory={startCategory}
            nodeColours={nodeColours}
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
            highlightedLinks={highlightedLinks}
            setHighlightedLinks={setHighlightedLinks}
            hiddenLinks={hiddenLinks}
            setHiddenLinks={setHiddenLinks}
            openColourPicker={openColourPicker}
            removeMenu={() => setContextTooltip(undefined)}
          />
        </Tooltip>
      )}
      {colourPicker && (
        <Tooltip
          x={colourPicker.x}
          y={colourPicker.y}
          removeFn={() => setColourPicker(undefined)}
        >
          <ColourPicker
            colour={colourPicker.colour}
            confirmColour={confirmColour}
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
