import { h } from "preact";
import styled, { keyframes } from "styled-components";

import { useHelp, useQuery } from "../hooks";
import { Overview } from "./overview/Overview";
import { Graph } from "./graph/Graph";
import { Tooltip } from "./general/Tooltip";
import { Help } from "./general/Help";

const fadeIn = keyframes`
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    top: rgba(0, 0, 0, 0.5);;
  }
`;

const HelpOverlay = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  inset: 0px;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);

  animation: ${fadeIn} 300ms linear;
`;

const HelpSvg = styled.svg`
  z-index: 3;
  position: fixed;
  left: ${(props) => props.x ?? 0}px;
  top: ${(props) => props.y ?? 0}px;

  ${(props) =>
    !props.x &&
    `
    display: none;
  `}
`;

export const LoggedIn = () => {
  const { data, status, refetch } = useQuery("user_anime_list");

  const {
    readyToRun,
    helpIndex,
    setHelpRequired,
    tooltipCoords,
    progressHelp,
    svgProps,
  } = useHelp(status === "success");

  return (
    <main>
      {readyToRun && (
        <>
          {tooltipCoords.x && tooltipCoords.y && (
            <Tooltip
              x={tooltipCoords.x}
              y={tooltipCoords.y}
              pd={15}
              // atPoint={true}
            >
              <Help
                helpIndex={helpIndex}
                progressHelp={progressHelp}
                setHelpRequired={setHelpRequired}
              />
            </Tooltip>
          )}
          <HelpOverlay />
          {svgProps && (
            <HelpSvg {...svgProps}>
              <use
                id="help-use"
                href={svgProps && `#hlp-${helpIndex}`}
                x={-svgProps.x}
              />
            </HelpSvg>
          )}
        </>
      )}
      <Overview data={data} status={status} />
      <Graph
        data={data}
        status={status}
        refetch={refetch}
        setHelpRequired={setHelpRequired}
      />
    </main>
  );
};

export default LoggedIn;
