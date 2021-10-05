import styled, { keyframes } from "styled-components";

import { useMemo, useReducer, useEffect } from "preact/hooks";
import { useHelp, useQuery } from "hooks";
import { Graph, Overview, Help, Tooltip } from "components";

const DEFAULT_LIMIT = 25;
const MAX_HISTORY = 50;

const LIST_STATUS = {
  anime: ["Completed", "Watching", "On Hold", "Dropped", "Plan To Watch"],
  manga: ["Completed", "Reading", "On Hold", "Dropped", "Plan To Read"],
};

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

const writeSankeyHistory = (state) => {
  let sankeyHistory = [...state.sankeyHistory];
  let historyIndex = state.historyIndex;

  if (state.sankeyHistory.length >= MAX_HISTORY) sankeyHistory.shift();

  sankeyHistory = [
    ...sankeyHistory.filter((_e, i) => i <= historyIndex),
    state,
  ];
  historyIndex = Math.min(historyIndex + 1, MAX_HISTORY);

  return { historyIndex, sankeyHistory };
};

const sankeyReducer = (state, action) => {
  switch (action.type) {
    case "setData": {
      const newState = {
        ...state,
        data: action.payload,
        filteredData: action.payload,
        queryStatus: action.queryStatus,
        nodeLimit: Math.min(action.payload.length, DEFAULT_LIMIT),
      };

      return {
        ...newState,
        sankeyHistory: [newState],
      };
    }

    case "updateStartCategory": {
      const newState = {
        ...state,
        nodeFilter: LIST_STATUS[action.startCategory].map((status) => ({
          name: status,
          active: true,
        })),
        startCategory: action.startCategory,
        hiddenLinks: [],
        highlightedLinks: [],
        nodeColours: [],
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "updateEndCategory": {
      const newState = {
        ...state,
        endCategory: action.endCategory,
        hiddenLinks: [],
        highlightedLinks: [],
        nodeColours: [],
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "updateNodeLimit": {
      const newState = {
        ...state,
        nodeLimit: action.limit,
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "updateNodeFilter": {
      const newData = state.data.filter(
        (item) =>
          action.nodeFilter.find((filter) => filter.name === item.status).active
      );

      const newState = {
        ...state,
        filteredData: newData,
        nodeFilter: action.nodeFilter,
        nodeLimit: Math.min(newData.length, DEFAULT_LIMIT),
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "updateStartSortDirection": {
      const newState = {
        ...state,
        startSort: {
          type: state.startSort.type,
          direction: state.startSort.direction === "ASC" ? "DESC" : "ASC",
        },
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "updateStartSortType": {
      const newState = {
        ...state,
        startSort: {
          type: action.sortType,
          direction: state.startSort.direction,
        },
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "updateEndSortDirection": {
      const newState = {
        ...state,
        endSort: {
          type: state.endSort.type,
          direction: state.endSort.direction === "ASC" ? "DESC" : "ASC",
        },
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "unhighlightLinks": {
      const newState = {
        ...state,
        highlightedLinks: state.highlightedLinks.filter(
          (link) => !action.links.includes(link)
        ),
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "highlightLinks": {
      const newState = {
        ...state,
        highlightedLinks: [...state.highlightedLinks, ...action.links],
        hiddenLinks: state.hiddenLinks.filter(
          (link) => !action.links.includes(link)
        ),
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "unhideLinks": {
      const newState = {
        ...state,
        hiddenLinks: state.hiddenLinks.filter(
          (link) => !action.links.includes(link)
        ),
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "hideLinks": {
      const newState = {
        ...state,
        hiddenLinks: [...state.hiddenLinks, ...action.links],
        highlightedLinks: state.highlightedLinks.filter(
          (link) => !action.links.includes(link)
        ),
      };

      return {
        ...newState,
        ...writeSankeyHistory(newState),
      };
    }
    case "undoAction": {
      return {
        ...state.sankeyHistory[action.index - 1],
        sankeyHistory: state.sankeyHistory,
        historyIndex: action.index - 1,
      };
    }
    case "redoAction": {
      return {
        ...state.sankeyHistory[action.index + 1],
        sankeyHistory: state.sankeyHistory,
        historyIndex: action.index + 1,
      };
    }
    default:
      return state;
  }
};

export const LoggedIn = ({ useMock }) => {
  const [sankeyState, updateSankey] = useReducer(sankeyReducer, {
    // Data
    data: [],
    filteredData: [],
    queryStatus: "loading",

    // Sorts
    startCategory: "anime",
    endCategory: "score",
    startSort: {
      type: "date",
      direction: "DESC",
    },
    endSort: {
      type: "alphabetical",
      direction: "DESC",
    },

    // Filter
    nodeFilter: LIST_STATUS["anime"].map((status) => ({
      name: status,
      active: true,
    })),
    nodeLimit: DEFAULT_LIMIT,

    // History Management
    sankeyHistory: [],
    historyIndex: 0,

    // Link effects
    hiddenLinks: [],
    highlightedLinks: [],
    nodeColours: [],
  });

  const { data, status, refetch } = useQuery(
    `${useMock ? "mock" : "user"}_${sankeyState.startCategory}_list`
  );

  const pathToData = useMemo(() => data?.data ?? [], [data]);
  const hasNextPage = useMemo(() => data?.hasNextPage, [data]);

  useEffect(
    () =>
      updateSankey({
        type: "setData",
        payload: pathToData,
        queryStatus: status,
      }),
    [pathToData, status]
  );

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
        startCategory={sankeyState.startCategory}
      />
      <Graph
        sankeyState={sankeyState}
        updateSankey={updateSankey}
        hasNextPage={hasNextPage}
        status={sankeyState.queryStatus}
        refetch={refetch}
        helpActive={readyToRun}
        setHelpRequired={setHelpRequired}
      />
    </main>
  );
};
