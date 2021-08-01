import { h } from "preact";
import styled from "styled-components";
import {
  format as d3Format,
  event,
  scaleOrdinal,
  schemeCategory10,
  select,
  interpolateNumber,
} from "d3";
import { sankey as d3Sankey } from "d3-sankey";
import { useEffect, useRef, useCallback, useMemo } from "preact/hooks";

//https://gist.github.com/chriswhong/dd794c5ca90769602066
const customLinkHorizontal = (link) => {
  const sourceLinkCount = link.source.sourceLinks.length;
  const targetLinkCount = link.target.targetLinks.length;
  const widthStart = (link.source.y1 - link.source.y0) / sourceLinkCount;
  const widthEnd = (link.target.y1 - link.target.y0) / targetLinkCount;

  const curvature = 0.6;

  // Arbitrary number chosen to keep the width of chords consistent -> https://yqnn.github.io/svg-path-editor/
  const curvatureModifer = 40;

  const x0 = link.source.x1,
    x1 = link.target.x0,
    xi = interpolateNumber(x0, x1),
    x2 = xi(curvature),
    x3 = xi(1 - curvature),
    y0 = link.source.y0 + link.source.sourceLinks.indexOf(link) * widthStart,
    y1 = link.target.y0 + widthEnd * link.target.targetLinks.indexOf(link);

  return `M${x0},${y0}C${
    y0 < y1 ? x2 + curvatureModifer : x2 - curvatureModifer
  },${y0} ${x3},${y1} ${x1},${y1}L${x1},${y1 + widthEnd}C${
    y0 < y1 ? x3 - curvatureModifer : x3 + curvatureModifer
  },${y1 + widthEnd} ${x2},${y0 + widthStart} ${x0},${
    y0 + widthStart
  }L${x0},${y0}`;
};

const Wrapper = styled.div`
  & .link {
    fill: none;
    stroke: #ffffff;
    stroke-opacity: 0.2;

    &:hover {
      stroke-opacity: 0.5;
    }
  }
`;

export const Sankey = ({
  dataNodes,
  dataLinks,
  dimensions: { width, height },
  nodeSide = 50,
  nodePadding = 50,
  endNodeModifier = 0,
}) => {
  let sankeyRef = useRef();

  const scale = useMemo(() => scaleOrdinal(schemeCategory10), []);
  const color = useCallback((name) => scale(name.replace(/ .*/, "")), [scale]);

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

    // Transform start nodes
    nodes
      .filter((node) => node.targetLinks.length === 0)
      .forEach((node, index) => {
        node.y0 = 1 + (nodeSide + nodePadding) * index;
        node.y1 = 1 + nodeSide + (nodeSide + nodePadding) * index;
      });

    // Transform end nodes
    nodes
      .filter((node) => node.targetLinks.length > 0)
      .forEach((node, index, arr) => {
        const height =
          (nodeSide + endNodeModifier) * (node.targetLinks.length || 1);

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

    const format = (d) => `$${d3Format(",.0f")(d)}`;

    // Start nodes
    svg
      .append("g")
      .attr("stroke", "#000")
      .selectAll("rect")
      .data(nodes.filter((d) => d.targetLinks.length === 0))
      .enter()
      .append("image")
      .attr("xlink:href", (d) => d.photo)
      // .attr("preserveAspectRatio", "xMaxYMin")
      .attr("x", 0) // Change this for title on left
      .attr("y", (d) => d.y0)
      .attr("width", nodeSide)
      .attr("height", nodeSide);
    // .on("click", onNodeClick)
    // .style("cursor", "pointer");
    // .on("mouseover", (d) => {
    //   infoPopup.transition().duration(200).style("opacity", 0.9);
    //   infoPopup
    //     .html(getPopupContent(d))
    //     .style("left", `${event.pageX}px`)
    //     .style("top", `${event.pageY - 28}px`);
    // })
    // .on("mouseout", () => {
    //   infoPopup.transition().duration(500).style("opacity", 0);
    // });

    // End nodes
    svg
      .append("g")
      .attr("stroke", "#000")
      .selectAll("rect")
      .data(nodes.filter((d) => d.targetLinks.length > 0))
      .enter()
      .append("rect")
      .attr("width", nodeSide)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .style("fill", (d) => color(d.name))
      .style("cursor", "pointer");

    // Links
    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .selectAll("g")
      .data(links)
      .enter()
      .append("g");

    link
      .append("path")
      .attr("d", (d) => customLinkHorizontal(d))
      .attr("fill", (d) => color(d.target.name))
      .attr("opacity", 0.5);

    // Text
    svg
      .append("g")
      .style("font", "10px sans-serif")
      .style("fill", "#ffffff")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr("y", (d) => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
      .text((d) => `${d.name} (${format(d.value)})`);
  }, [
    width,
    height,
    dataNodes,
    dataLinks,
    nodeSide,
    nodePadding,
    endNodeModifier,
    color,
  ]);

  return <Wrapper ref={sankeyRef} />;
};
