import { h } from "preact";
import styled, { keyframes } from "styled-components";

import { useMemo, useState } from "preact/hooks";
import { useHelp, useQuery } from "hooks";
import { Graph, Overview, Help, Tooltip } from "components";

const fadeIn = keyframes`
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    top: rgba(0, 0, 0, 0.5);
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

export const LoggedIn = ({ useMock }) => {
  const [startCategory, setStartCategory] = useState("anime");

  const { data, status, refetch } = useQuery(
    `${useMock ? "mock" : "user"}_${startCategory}_list`
  );

  const pathToData = useMemo(() => data?.data, [data]);
  const hasNextPage = useMemo(() => data?.hasNextPage, [data]);

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
              forceTranslate={tooltipCoords.forceTranslate}
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
      <Overview
        data={pathToData}
        status={status}
        useMock={useMock}
        startCategory={startCategory}
      />
      <Graph
        data={pathToData}
        hasNextPage={hasNextPage}
        status={status}
        refetch={refetch}
        helpActive={readyToRun}
        setHelpRequired={setHelpRequired}
        startCategory={startCategory}
        setStartCategory={setStartCategory}
      />
    </main>
  );
};
