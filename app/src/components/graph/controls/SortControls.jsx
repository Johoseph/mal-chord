import styled from "styled-components";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";

import { Dropdown } from "components";

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

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Sort = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 5px;
  font-size: 0.9rem;
`;

const SortButtonWrapper = styled.div`
  margin-right: 6px;
  width: 1.5rem;
  height: 1.5rem;
`;

const SortButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: none;
  background: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;

  &:hover,
  :focus {
    background: #252525;
  }
`;

export const SortControls = ({ sankeyState, updateSankey }) => {
  return (
    <Sort>
      <Flex className="hlp-7 right-25">
        <SortButtonWrapper>
          <SortButton
            onClick={() => updateSankey({ type: "updateStartSortDirection" })}
            aria-label="Toggle anime sort direction"
          >
            {sankeyState.startSort.direction === "ASC" ? (
              <HiArrowNarrowUp />
            ) : (
              <HiArrowNarrowDown />
            )}
          </SortButton>
        </SortButtonWrapper>
        <Dropdown
          value={sankeyState.startSort.type}
          setValue={(val) =>
            updateSankey({ type: "updateStartSortType", sortType: val })
          }
          options={sortOptions}
          minWidth={120}
        />
      </Flex>
      <Flex className="hlp-7">
        <SortButtonWrapper>
          <SortButton
            onClick={() => updateSankey({ type: "updateEndSortDirection" })}
            aria-label="Toggle end category sort direction"
          >
            {sankeyState.endSort.direction === "ASC" ? (
              <HiArrowNarrowUp />
            ) : (
              <HiArrowNarrowDown />
            )}
          </SortButton>
        </SortButtonWrapper>
        {sankeyState.endSort.type}
      </Flex>
    </Sort>
  );
};
