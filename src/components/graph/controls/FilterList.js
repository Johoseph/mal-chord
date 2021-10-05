import { useCallback } from "preact/hooks";
import styled from "styled-components";

import { Checkbox } from "components";

const Wrapper = styled.div`
  font-size: 1rem;
`;

const ListItem = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
`;

export const FilterList = ({ nodeFilter, updateSankey }) => {
  const handleCheck = (category) => {
    const newFilter = [...nodeFilter];
    const indexToChange = nodeFilter.findIndex(
      (item) => item.name === category
    );

    newFilter[indexToChange] = {
      name: category,
      active: !nodeFilter[indexToChange].active,
    };

    updateSankey({ type: "updateNodeFilter", nodeFilter: newFilter });
  };

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
