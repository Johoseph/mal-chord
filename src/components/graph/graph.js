import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Sankey } from "./sankey";
import useResizeObserver from "use-resize-observer";
import { SankeyControls } from "./sankeyControls";

const HEIGHT_MULTIPLIER = 40;

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

  const dataLinks = startNodes.map((anime) => ({
    source: anime.node,
    target: endNodes.find((endNode) => anime.linker === endNode.name).node,
    value: 1,
  }));

  return { dataNodes: [...startNodes, ...endNodes], dataLinks };
};

export const Graph = ({ data }) => {
  const { ref, width } = useResizeObserver();
  const [height, setHeight] = useState(100);

  const [startSort, setStartSort] = useState("A-Z");
  const [endSort, setEndSort] = useState("Z-A");
  const [endCategory, setEndCategory] = useState("score");

  const { dataNodes, dataLinks } = getSankeyFormat(
    data?.data || [],
    startSort,
    endSort,
    endCategory
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      setHeight((data.data?.length || 0) * HEIGHT_MULTIPLIER);
    }
  }, [data]);

  return (
    <div ref={ref}>
      {data ? (
        <>
          <SankeyControls
            setStartSort={setStartSort}
            setEndSort={setEndSort}
            setEndCategory={setEndCategory}
            endCategory={endCategory}
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
