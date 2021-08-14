import { h } from "preact";
import { useTabVisible } from "../../../hooks";
import { SankeyControlsLoading } from "./SankeyControlsLoading";
import { SankeyLoading } from "./SankeyLoading";

export const GraphLoading = () => {
  const { tabVisible } = useTabVisible();

  return (
    <>
      <SankeyControlsLoading />
      {tabVisible && <SankeyLoading />}
    </>
  );
};
