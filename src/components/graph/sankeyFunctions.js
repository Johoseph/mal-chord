export const getSankeyFormat = (data, startSort, endSort, endCategory) => {
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
            return comparer > comparee;
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
    nodeCount: Math.max(startNodes.length, endNodes.length),
  };
};
