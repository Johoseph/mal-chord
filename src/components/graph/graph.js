import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Sankey } from "./sankey";
import useResizeObserver from "use-resize-observer";
import { SankeyControls } from "./sankeyControls";

const HEIGHT_MULTIPLIER = 40;

const endCategories = [
  {
    value: "rating",
    label: "anime rating",
  },
  {
    value: "genre",
    label: "genre",
  },
  {
    value: "studio",
    label: "studio",
  },
  {
    value: "status",
    label: "your list status",
  },
  {
    value: "score",
    label: "your score",
  },
];

const sortOptions = [
  {
    value: "alphabetical",
    label: "alphabetical",
  },
  {
    value: "date",
    label: "last updated",
  },
  {
    value: "popularity",
    label: "popularity",
  },
  {
    value: "ranking",
    label: "ranking",
  },
  {
    value: "score",
    label: "your score",
  },
];

const getSankeyFormat = (data, startSort, endSort, endCategory) => {
  const nodeBuffer = data.length;

  const startNodes = data
    .sort((a, b) => {
      const comparer = startSort.direction === "ASC" ? a.node : b.node;
      const comparee = startSort.direction === "ASC" ? b.node : a.node;

      switch (startSort.type) {
        case "alphabetical":
          return comparer.title.localeCompare(comparee.title);
        case "ranking":
          return comparer.rank > comparee.rank ? 1 : -1;
        case "popularity":
          return comparer.popularity > comparee.popularity ? 1 : -1;
        case "score":
          return comparer.my_list_status.score > comparee.my_list_status.score
            ? 1
            : -1;
        case "date":
          return comparer.my_list_status.updated_at.localeCompare(
            comparee.my_list_status.updated_at
          );
      }
    })
    .map((anime, index) => {
      let linker;

      switch (endCategory) {
        case "score":
          linker = [
            anime.node.my_list_status.score === 0
              ? "Not Scored"
              : anime.node.my_list_status.score.toString(),
          ];
          break;
        case "status":
          linker = [anime.node.my_list_status.status];
          break;
        case "rating":
          linker = [anime.node.rating];
          break;
        case "genre":
          linker = anime.node.genres.map((genre) => genre.name);
          break;
        case "studio":
          linker = anime.node.studios.map((studio) => studio.name);
          break;
      }

      return {
        node: index,
        name: anime.node.title,
        photo: anime.node.main_picture.medium,
        linker,
      };
    });

  const endNodes = data
    .map((anime) => {
      switch (endCategory) {
        case "score":
          return {
            name:
              anime.node.my_list_status.score === 0
                ? "Not Scored"
                : anime.node.my_list_status.score.toString(),
          };
        case "status":
          return { name: anime.node.my_list_status.status };
        case "rating":
          return { name: anime.node.rating };
        case "genre": {
          return anime.node.genres.map((genre) => ({ name: genre.name }));
        }
        case "studio": {
          return anime.node.studios.map((studio) => ({ name: studio.name }));
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
    .sort((a, b) => {
      const comparer = endSort.direction === "ASC" ? a.name : b.name;
      const comparee = endSort.direction === "ASC" ? b.name : a.name;

      switch (endSort.type) {
        case "alphabetical":
          if (comparer === "Not Scored") return -1;
          if (comparee === "Not Scored") return 1;
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

export const Graph = ({ data }) => {
  const { ref, width } = useResizeObserver();
  const [height, setHeight] = useState(100);

  const [startSort, setStartSort] = useState({
    type: "alphabetical",
    direction: "ASC",
  });
  const [endSort, setEndSort] = useState({
    type: "alphabetical",
    direction: "DESC",
  });
  const [endCategory, setEndCategory] = useState("score");

  const { dataNodes, dataLinks, nodeCount } = getSankeyFormat(
    data?.data || [],
    startSort,
    endSort,
    endCategory
  );

  useEffect(() => {
    setHeight((nodeCount || 0) * HEIGHT_MULTIPLIER);
  }, [nodeCount]);

  return (
    <div ref={ref}>
      {data ? (
        <>
          <SankeyControls
            setStartSort={setStartSort}
            setEndSort={setEndSort}
            setEndCategory={setEndCategory}
            startSort={startSort}
            endSort={endSort}
            endCategory={endCategory}
            categoryOptions={endCategories}
            sortOptions={sortOptions}
          />
          <Sankey
            dataNodes={dataNodes}
            dataLinks={dataLinks}
            dimensions={{ width, height }}
          />
        </>
      ) : (
        <div>Sankey Loading</div>
      )}
    </div>
  );
};
