import { h } from "preact";
import { select } from "d3";
import { sankey as d3Sankey } from "d3-sankey";
import {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "preact/hooks";

import { Tooltip } from "../general/Tooltip";
import { customLinkHorizontal, getNodeColour } from "./sankeyFunctions";
import { NodeCard } from "./cards/NodeCard";
import { ContextMenu } from "./cards/ContextMenu";

export const Sankey = ({
  endCategory,
  dataNodes,
  dataLinks,
  dimensions: { width, height },
  nodeSide = 50,
  nodePadding = 50,
  endNodeModifier = 0,
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
  }, [endCategory]);

  useEffect(() => {
    select(sankeyRef.current).select("svg").remove();

    // Sankey parent SVG
    const svg = select(sankeyRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("width", "100%")
      .style("height", "auto");

    let { nodes, links } = d3Sankey()
      .nodeWidth(nodeSide)
      .nodePadding(nodePadding)
      .nodeSort(null)
      .extent([
        [1, 1],
        [width, height],
      ])({
      nodes: dataNodes.map((d) => Object.assign({}, d)),
      links: dataLinks.map((d) => Object.assign({}, d)),
    });

    const startNodes = nodes.filter((d) => d.targetLinks.length === 0);
    const endNodes = nodes.filter((d) => d.targetLinks.length > 0);

    // Transform start nodes
    nodes
      .filter((node) => node.targetLinks.length === 0)
      .forEach((node, index) => {
        node.x0 += widthModifier;
        node.x1 += widthModifier;

        node.y0 = 1 + (nodeSide + nodePadding) * index;
        node.y1 = 1 + nodeSide + (nodeSide + nodePadding) * index;
      });

    // Transform end nodes
    nodes
      .filter((node) => node.targetLinks.length > 0)
      .forEach((node, index, arr) => {
        const height =
          (nodeSide + endNodeModifier) * (node.targetLinks.length || 1);
        node.x0 -= widthModifier;
        node.x1 -= widthModifier;

        if (index > 0) {
          node.y0 = arr
            .filter((arrNode, arrIndex) => arrIndex < index)
            .reduce(
              (total, prev) => total + (prev.y1 - prev.y0) + nodePadding,
              0
            );

          node.y1 = node.y0 + height;
        } else {
          node.y0 = 0;
          node.y1 = height;
        }
      });

    // Transform links
    links.forEach((link) => {
      const targetNode = nodes.find((node) => node.node === link.target.node);
      const targetLinkCount = targetNode.targetLinks.length;

      const singleLinkWidth = (targetNode.y1 - targetNode.y0) / targetLinkCount;

      link.y1 =
        targetNode.y0 +
        singleLinkWidth * targetNode.targetLinks.indexOf(link) +
        singleLinkWidth / 2;
    });

    // Start nodes
    svg
      .append("g")
      .attr("id", "start-nodes")
      .selectAll("rect")
      .data(startNodes)
      .enter()
      .append("image")
      .attr("href", (d) => d.photo)
      .attr("x", (d) => d.x0) // Change this for title on left
      .attr("y", (d) => d.y0)
      .attr("width", nodeSide)
      .attr("height", nodeSide)
      .attr("class", "listener-ignore")
      .style("cursor", "pointer")
      .on("contextmenu", handleNodeRightClick)
      .on("click", handleNodeClick);

    // End nodes
    svg
      .append("g")
      .attr("id", "end-nodes")
      .selectAll("rect")
      .data(endNodes)
      .enter()
      .append("rect")
      .attr("width", nodeSide)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("class", "listener-ignore")
      .style("fill", (d) => getNodeColour(d.name))
      .style("cursor", "pointer")
      .on("contextmenu", handleNodeRightClick)
      .on("click", handleNodeClick);

    // Links
    const link = svg
      .append("g")
      .attr("id", "links")
      .selectAll("g")
      .data(
        links.filter(
          (link) =>
            !highlightedLinks.includes(
              `${link.source.name}|${link.target.name}`
            ) &&
            !hiddenLinks.includes(`${link.source.name}|${link.target.name}`)
        )
      )
      .enter()
      .append("g");

    link
      .append("path")
      .attr("d", (d) => customLinkHorizontal(d, startNodes.length))
      .attr("fill", (d) => getNodeColour(d.target.name))
      .attr("opacity", 0.5)
      .attr("id", (d) => d.index)
      .on("mouseover", (e) => {
        e.target.style.opacity = 1;
        document.getElementById("links").append(e.target.parentNode);
      })
      .on("mouseout", (e) => (e.target.style.opacity = 0.5));

    // Highlighted Links
    const highlightedLink = svg
      .append("g")
      .attr("id", "highlighted-links")
      .selectAll("g")
      .data(
        links
          .filter((link) =>
            highlightedLinks.includes(`${link.source.name}|${link.target.name}`)
          )
          // Sort by highlight order
          .sort(
            (firstEl, secondEl) =>
              highlightedLinks.indexOf(
                `${firstEl.source.name}|${firstEl.target.name}`
              ) -
              highlightedLinks.indexOf(
                `${secondEl.source.name}|${secondEl.target.name}`
              )
          )
      )
      .enter()
      .append("g");

    highlightedLink
      .append("path")
      .attr("d", (d) => customLinkHorizontal(d, startNodes.length))
      .attr("fill", (d) => getNodeColour(d.target.name))
      .attr("opacity", 1)
      .attr("id", (d) => d.index);

    // Start Node Text
    svg
      .append("g")
      .style("font", "10px sans-serif")
      .style("fill", "#ffffff")
      .selectAll("text")
      .data(startNodes)
      .enter()
      .append("text")
      .attr("x", (d) => d.x1 + 5)
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .style("font-size", () => `${Math.max(nodeSide / 3, 10)}`)
      .text((d) => d.name);

    // End Node Text
    svg
      .append("g")
      .style("font", "10px sans-serif")
      .style("fill", "#ffffff")
      .selectAll("text")
      .data(endNodes)
      .enter()
      .append("text")
      .attr("x", (d) => d.x0 - 5)
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .style("font-size", () => `${Math.max(nodeSide / 3, 10)}`)
      .text((d) => d.name);

    // Help Classes
    svg
      .select("#start-nodes .listener-ignore")
      .attr("id", "hlp-7")
      .classed("hlp-7 top-10 forceY", true);
    svg
      .select("#end-nodes .listener-ignore")
      .attr("id", "hlp-8")
      .classed("hlp-8 top-10 forceY left-10", true);
  }, [
    width,
    height,
    dataNodes,
    dataLinks,
    nodeSide,
    nodePadding,
    endNodeModifier,
    widthModifier,
    handleNodeClick,
    handleNodeRightClick,
    highlightedLinks,
    hiddenLinks,
  ]);

  return (
    <>
      <div ref={sankeyRef} />
      {animeTooltip && (
        <Tooltip
          x={animeTooltip.x}
          y={animeTooltip.y}
          removeFn={() => setAnimeTooltip(undefined)}
        >
          <NodeCard node={animeTooltip.data} />
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
    </>
  );
};
