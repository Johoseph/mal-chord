import { useCallback, useContext } from "preact/hooks";
import styled from "styled-components";

import { Checkbox } from "components";
import { HistoryContext } from "contexts";

const Wrapper = styled.div`
  font-size: 1rem;
`;

const ListItem = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
`;

export const FilterList = ({ nodeFilter, setNodeFilter }) => {
  const { writeToHistory } = useContext(HistoryContext);

  const handleCheck = useCallback(
    (category) => {
      setNodeFilter((prev) => {
        const newFilter = [...prev];
        const indexToChange = prev.findIndex((item) => item.name === category);

        newFilter[indexToChange] = {
          name: category,
          active: !prev[indexToChange].active,
        };

        writeToHistory([
          {
            fn: setNodeFilter,
            undo: prev,
            redo: newFilter,
          },
        ]);

        return newFilter;
      });
    },
    [setNodeFilter, writeToHistory]
  );

  // Prevent users from de-selecting all options
  const handleDisabled = useCallback(
    (category) => {
      const activeCategories = nodeFilter.filter((item) => item.active);

      if (
        activeCategories.length === 1 &&
        activeCategories.find((item) => item.name === category)
      )
        return true;

      return false;
    },
    [nodeFilter]
  );

  return (
    <Wrapper>
      {nodeFilter.map((category, i) => {
        const disabled = handleDisabled(category.name);

        return (
          <ListItem key={`${category.name}-${i}`}>
            <Checkbox
              label={category.name}
              id={`${category.name}-checkbox`}
              checked={category.active}
              onChange={() => handleCheck(category.name)}
              disabled={disabled}
            />
          </ListItem>
        );
      })}
    </Wrapper>
  );
};