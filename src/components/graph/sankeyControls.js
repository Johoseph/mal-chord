import { h } from "preact";
import styled from "styled-components";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";

import { Dropdown } from "../general/Dropdown";

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto 30px auto;

  @media (max-width: 1000px) {
    width: 95%;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 5px;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Chord = styled.div`
  background: #2e51a2;
  height: 0.3rem;
  width: 100%;
  position: relative;
  top: 2px;
  margin: 0 20px;
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

export const SankeyControls = ({
  setStartSort,
  setEndSort,
  setEndCategory,
  startSort,
  endSort,
  endCategory,
  categoryOptions,
  sortOptions,
}) => {
  return (
    <Wrapper>
      <Header>
        <span>anime</span>
        <Chord />
        <Dropdown
          value={endCategory}
          setValue={setEndCategory}
          options={categoryOptions}
          minWidth={150}
          alignment="right"
          optionFontSize={1}
        />
      </Header>
      <Sort>
        <Flex>
          <SortButtonWrapper>
            <SortButton
              onClick={() =>
                setStartSort((prev) => ({
                  type: prev.type,
                  direction: prev.direction === "ASC" ? "DESC" : "ASC",
                }))
              }
              aria-label="Toggle anime sort direction"
            >
              {startSort.direction === "ASC" ? (
                <HiArrowNarrowUp />
              ) : (
                <HiArrowNarrowDown />
              )}
            </SortButton>
          </SortButtonWrapper>
          <Dropdown
            value={startSort.type}
            setValue={(val) =>
              setStartSort((prev) => ({ type: val, direction: prev.direction }))
            }
            options={sortOptions}
            minWidth={120}
          />
        </Flex>
        <Flex>
          <SortButtonWrapper>
            <SortButton
              onClick={() =>
                setEndSort((prev) => ({
                  type: prev.type,
                  direction: prev.direction === "ASC" ? "DESC" : "ASC",
                }))
              }
              aria-label="Toggle end category sort direction"
            >
              {endSort.direction === "ASC" ? (
                <HiArrowNarrowUp />
              ) : (
                <HiArrowNarrowDown />
              )}
            </SortButton>
          </SortButtonWrapper>
          {endSort.type}
        </Flex>
      </Sort>
    </Wrapper>
  );
};
