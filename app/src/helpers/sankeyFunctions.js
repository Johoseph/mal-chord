import {
  create,
  select,
  interpolateNumber,
  scaleOrdinal,
  schemeCategory10,
} from "d3";
import { sankey as d3Sankey } from "d3-sankey";
import { mathClamp } from "helpers";

export const getSankeyFormat = (
  data,
  startSort,
  endSort,
  endCategory,
  limit
) => {
  if (data.length !== limit)
    data = data
      .sort((firstEl, secondEl) =>
        secondEl.lastUpdated.localeCompare(firstEl.lastUpdated)
      )
      .filter((anime, index) => index < limit);

  const nodeBuffer = data.length;

  const startNodes = data
    .sort((firstEl, secondEl) => {
      const comparer = startSort.direction === "ASC" ? firstEl : secondEl;
      const comparee = startSort.direction === "ASC" ? secondEl : firstEl;

      switch (startSort.type) {
        case "alphabetical":
          return comparer.title.localeCompare(comparee.title);
        case "ranking":
          return comparer.rank > comparee.rank ? 1 : -1;
        case "popularity":
          return comparer.popularity > comparee.popularity ? 1 : -1;
        case "score":
          return comparer.score > comparee.score ? 1 : -1;
        case "date":
          return comparer.lastUpdated.localeCompare(comparee.lastUpdated);
      }
    })
    .map((anime, index) => {
      let linker;

      switch (endCategory) {
        case "score":
          linker = [anime.score === 0 ? "Not Scored" : anime.score.toString()];
          break;
        case "status":
          linker = [anime.status];
          break;
        case "rating":
          linker = [anime.rating];
          break;
        case "genre":
          linker = anime.genres;
          break;
        case "studio":
          linker = anime.studios;
          break;
        case "author":
          linker = anime.authors;
          break;
      }

      return {
        node: index,
        name: anime.title,
        id: anime.id,
        photo: anime.image,
        linker,
      };
    });

  const endNodes = data
    .map((anime) => {
      switch (endCategory) {
        case "score":
          return {
            name: anime.score === 0 ? "Not Scored" : anime.score.toString(),
          };
        case "status":
          return { name: anime.status };
        case "rating":
          return { name: anime.rating };
        case "genre": {
          return anime.genres.map((genre) => ({ name: genre }));
        }
        case "studio": {
          return anime.studios.map((studio) => ({ name: studio }));
        }
        case "author": {
          return anime.authors.map((author) => ({ name: author }));
        }
      }
    })
    .flat()
    .reduce(
      (uniqueArr, anime) =>
        uniqueArr.find((item) => item.name === anime.name)
          ? uniqueArr
          : [...uniqueArr, anime],
      []
    )
    .sort((firstEl, secondEl) => {
      const comparer =
        endSort.direction === "ASC" ? firstEl.name : secondEl.name;
      const comparee =
        endSort.direction === "ASC" ? secondEl.name : firstEl.name;

      switch (endSort.type) {
        case "alphabetical":
          if (comparer === "Not Scored") return -1;
          if (comparee === "Not Scored") return 1;
          if (parseInt(comparer, 10) && parseInt(comparer, 10))
            return parseInt(comparer, 10) > parseInt(comparee, 10) ? 1 : -1;
          return comparer.localeCompare(comparee);
      }
    })
    .map((anime, index) => ({ node: index + nodeBuffer, ...anime }));

  const dataLinks = startNodes
    .map((anime) => {
      return anime.linker.map((link) => ({
        source: anime.node,
        target: endNodes.find((endNode) => link === endNode.name).node,
        value: 1,
      }));
    })
    .flat();

  return {
    dataNodes: [...startNodes, ...endNodes],
    dataLinks,
    nodeCount: startNodes.length,
    nodeDifference: startNodes.length - endNodes.length || 0,
  };
};

//https://gist.github.com/chriswhong/dd794c5ca90769602066
export const customLinkHorizontal = (link, startNodeCount) => {
  const sourceLinkCount = link.source.sourceLinks.length;
  const targetLinkCount = link.target.targetLinks.length;
  const widthStart = (link.source.y1 - link.source.y0) / sourceLinkCount;
  const widthEnd = (link.target.y1 - link.target.y0) / targetLinkCount;

  const curvature = 0.6;

  // Arbitrary number chosen to keep the width of chords consistent -> https://yqnn.github.io/svg-path-editor/
  const curvatureModifer = mathClamp((startNodeCount - 560) / -14, 10, 40);

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

const scale = scaleOrdinal(schemeCategory10);

export const getNodeColour = (name) => scale(name.replace(/ .*/, ""));

export const checkCustomColour = (name, nodeList) => {
  const node = nodeList.find((node) => name === node.name);

  if (node) return node.colour;
  return getNodeColour(name);
};

export const handleSankeySvg = ({
  element,
  width,
  height,
  nodeSide,
  nodePadding,
  dataNodes,
  dataLinks,
  widthModifier,
  handleNodeClick,
  handleNodeRightClick,
  highlightedLinks,
  hiddenLinks,
  nodeDifference,
  nodeCount,
  nodeColours,
  useThumbnails = true,
}) => {
  let svg;

  // Sankey parent SVG
  if (element) {
    select(element).select("svg").remove();

    svg = select(element).append("svg");
  } else {
    svg = create("svg");
  }

  svg
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

  // Catering for differing node count on left -> right
  const endNodeModifier =
    // Catering for nodePadding
    (nodeDifference * nodePadding) / dataLinks.length -
    // Catering for more links than nodes
    ((dataLinks.length - nodeCount) * nodeSide) / dataLinks.length;

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
  let startG = svg
    .append("g")
    .attr("id", "start-nodes")
    .selectAll("rect")
    .data(startNodes);

  if (useThumbnails) {
    startG
      .enter()
      .append("image")
      .attr("href", (d) => d.photo)
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", nodeSide)
      .attr("height", nodeSide)
      .attr("class", "listener-ignore")
      .attr("crossorigin", "anonymous")
      .style("cursor", "pointer")
      .on("contextmenu", handleNodeRightClick)
      .on("click", handleNodeClick);
  } else {
    const defs = svg.select("#start-nodes").append("defs");

    for (const startNode of startNodes) {
      if (startNode.sourceLinks.length > 1) {
        const linkCount = startNode.sourceLinks.length;
        // const linearGradient = defs
        //   .append("linearGradient")
        //   .attr("id", `gradient-${startNode.id}`)
        //   .attr("gradientTransform", "rotate(90)");

        // Using zoomed radialGradient implementation as Canvg does not cater for linearGradient 'gradientTransform' property -> https://github.com/canvg/canvg/issues/476
        const radialGradient = defs
          .append("radialGradient")
          .attr("id", `gradient-${startNode.id}`)
          .attr("r", "10000%")
          .attr("cy", "-9900%");

        startNode.sourceLinks.forEach((link, i) =>
          // linearGradient
          //   .append("stop")
          //   .attr("offset", `${(100 / (linkCount - 1)) * i}%`)
          //   .attr("stop-color", checkCustomColour(link.target.name, nodeColours))

          radialGradient
            .append("stop")
            .attr("offset", `${99.1 + (0.8 / (linkCount - 1)) * i}%`)
            .attr(
              "stop-color",
              checkCustomColour(link.target.name, nodeColours)
            )
        );
      }
    }

    startG
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", nodeSide)
      .attr("height", nodeSide)
      .style("fill", (d) => {
        if (d.linker.length > 1) return `url('#gradient-${d.id}')`;
        return checkCustomColour(d.linker[0], nodeColours);
      });
  }

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
    .style("fill", (d) => checkCustomColour(d.name, nodeColours))
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
          ) && !hiddenLinks.includes(`${link.source.name}|${link.target.name}`)
      )
    )
    .enter()
    .append("g");

  link
    .append("path")
    .attr("d", (d) => customLinkHorizontal(d, startNodes.length))
    .attr("fill", (d) => checkCustomColour(d.target.name, nodeColours))
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
    .attr("fill", (d) => checkCustomColour(d.target.name, nodeColours))
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
    .style("font-family", "Roboto")
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
    .style("font-family", "Roboto")
    .text((d) => d.name);

  // Help Classes
  svg
    .select("#start-nodes .listener-ignore")
    .attr("id", "hlp-8")
    .classed("hlp-8 top-10 forceY", true);
  svg
    .select("#end-nodes .listener-ignore")
    .attr("id", "hlp-9")
    .classed("hlp-9 top-10 forceY left-10", true);

  // Conditional return ?!
  if (!element) {
    return svg.node();
  }
};
