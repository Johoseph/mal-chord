import { h } from "preact";
import { useTabVisible } from "hooks";
import { SankeyLoading, SankeyControlsLoading } from "components";

export const GraphLoading = () => {
  const { tabVisible } = useTabVisible();

  return (
    <>
      <SankeyControlsLoading />
      {tabVisible && <SankeyLoading />}
    </>
  );
};
