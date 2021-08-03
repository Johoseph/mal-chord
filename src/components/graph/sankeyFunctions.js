import { interpolateNumber, scaleOrdinal, schemeCategory10 } from "d3";
import { mathClamp } from "../../helpers";

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
