import { h } from "preact";
import styled from "styled-components";
import {
  format as d3Format,
  event,
  scaleOrdinal,
  schemeCategory10,
  select,
} from "d3";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "preact/hooks";

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

const getSankeyFormat = (data, startSort, endSort, endCategory) => {
  const nodeBuffer = data.length;

  const startNodes = data
    .map((anime, index) => {
      let linker;

      switch (endCategory) {
        case "score":
          linker = anime.node.my_list_status.score.toString();
          break;
      }

      return {
        node: index,
        name: anime.node.title,
        photo: anime.node.main_picture.medium,
        linker,
      };
    })
    .sort((a, b) => {
      switch (startSort) {
        case "A-Z":
          return a.name.localeCompare(b.name);
        case "Z-A":
          return b.name.localeCompare(a.name);
      }
    });

  const endNodes = data
    .map((anime) => {
      let value;

      switch (endCategory) {
        case "score":
          value = anime.node.my_list_status.score.toString();
          break;
      }

      return {
        name: value,
      };
    })
    .reduce(
      (uniqueArr, anime) =>
        uniqueArr.find((item) => item.name === anime.name)
          ? uniqueArr
          : [...uniqueArr, anime],
      []
    )
    .map((anime, index) => ({ node: index + nodeBuffer, ...anime }))
    .sort((a, b) => {
      switch (endSort) {
        case "A-Z":
          return a.name.localeCompare(b.name);
        case "Z-A":
          return b.name.localeCompare(a.name);
      }
    });

  const dataLinks = startNodes.map((anime, i) => ({
    source: anime.node,
    target: endNodes.find((endNode) => anime.linker === endNode.name).node,
    value: 1,
  }));

  return { dataNodes: [...startNodes, ...endNodes], dataLinks };
};

export const Sankey = ({ data, dimensions: { width, height } }) => {
  let sankeyRef = useRef();

  const [startSort, setStartSort] = useState("A-Z");
  const [endSort, setEndSort] = useState("Z-A");
  const [endCategory, setEndCategory] = useState("score");

  const { dataNodes, dataLinks } = getSankeyFormat(
    data.data,
    startSort,
    endSort,
    endCategory
  );

  console.log({ dataNodes, dataLinks });

  useEffect(() => {
    select(sankeyRef.current).select("svg").remove();

    // append the svg object to the body of the page
    const svg = select(sankeyRef.current)
      .append("svg")
      .attr("width", width)
      // .attr("height", height)
      .style("width", "100%")
      .style("height", "auto")
      .append("g");

    const json = {
      nodes: [
        {
          node: 0,
          name: "node0",
          photo: "https://api-cdn.myanimelist.net/images/anime/1958/93533.jpg",
        },
        { node: 1, name: "node1" },
        { node: 2, name: "node2" },
        { node: 3, name: "node3" },
        { node: 4, name: "node4" },
      ],
      links: [
        { source: 0, target: 2, value: 2 },
        { source: 1, target: 2, value: 2 },
        { source: 1, target: 3, value: 2 },
        { source: 0, target: 4, value: 2 },
        { source: 2, target: 3, value: 2 },
        { source: 2, target: 4, value: 2 },
        { source: 3, target: 4, value: 4 },
      ],
    };

    const { nodes, links } = d3Sankey()
      .nodeWidth(40)
      .nodePadding(20)
      .nodeSort(null)
      .extent([
        [1, 1],
        [width - 1, height],
      ])({
      nodes: dataNodes.map((d) => Object.assign({}, d)),
      links: dataLinks.map((d) => Object.assign({}, d)),
    });

    const scale = scaleOrdinal(schemeCategory10);
    const color = (name) => scale(name.replace(/ .*/, ""));
    const format = (d) => `$${d3Format(",.0f")(d)}`;

    // Non-photos
    svg
      .append("g")
      .attr("stroke", "#000")
      .selectAll("rect")
      .data(nodes.filter((d) => !d.photo))
      .enter()
      .append("rect")
      .attr("x", (d) => (d.x0 < width / 2 ? d.x1 - 41 : d.x0 + 41))
      .attr("y", (d) => (d.y0 + d.y1) / 2 - 20)
      .attr("width", () => 40)
      .attr("height", () => 40)
      .style("fill", (d) => color(d.name))
      .style("cursor", "pointer");

    // Photos
    svg
      .append("g")
      .attr("stroke", "#000")
      .selectAll("rect")
      .data(nodes.filter((d) => d.photo))
      .enter()
      .append("image")
      .attr("xlink:href", (d) => d.photo)
      .attr("x", (d) => (d.x0 < width / 2 ? d.x1 - 41 : d.x0 + 41))
      .attr("y", (d) => (d.y0 + d.y1) / 2 - 20)
      .attr("width", 40)
      .attr("height", 40)
      // .on("click", onNodeClick)
      .style("cursor", "pointer");
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

    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .selectAll("g")
      .data(links)
      .enter()
      .append("g");
    // .style("mix-blend-mode", "multiply");

    const gradient = link
      .append("linearGradient")
      .attr("id", (d) => {
        d.uid = Math.floor(Math.random() * 100000);
        return d.uid;
      })
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", (d) => d.source.x1)
      .attr("x2", (d) => d.target.x0);

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", (d) => color(d.source.name));

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", (d) => color(d.target.name));

    link
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d) => `url(#${d.uid})`)
      .attr("stroke-width", (d) => Math.max(1, d.width));

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
  }, [width, height, dataNodes, dataLinks]);

  return <Wrapper ref={sankeyRef} />;
};
