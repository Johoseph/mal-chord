import { h } from "preact";
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "preact/hooks";
import styled from "styled-components";
import { mathClamp } from "../../helpers";

const Wrapper = styled.div`
  font-size: 0.8rem;
  margin-left: 15px;

  position: relative;
  top: 2px;

  outline: none;
  border: 1px solid transparent;
  padding: 5px 2px;
  border-radius: 5px;

  &:focus-visible {
    border-color: #484848;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Viewing = styled.span`
  white-space: nowrap;
  cursor: pointer;
`;

const Input = styled.input`
  width: 38px;
  margin-right: 5px;
  outline: none;
  background: #1f1f1f;
  border: 1px solid #6d6d6d;
  height: 100%;
  border-radius: 5px;
  font-family: Roboto;

  position: relative;
  bottom: 1px;
`;

export const AnimeCountFilter = ({ count, limit, setLimit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const incrementChange = useMemo(
    () => Math.round(mathClamp(count / 20, 1, 20)),
    [count]
  );

  let inputRef = useRef();

  const handleSetLimit = useCallback(() => {
    const submittedValue = parseInt(inputRef.current?.value, 10);

    if (submittedValue && 0 < submittedValue <= limit) setLimit(submittedValue);
    setIsEditing(false);
  }, [limit, setLimit]);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const numberOfScrolls = (-1 * e.deltaY) / 100;

      setLimit((prev) =>
        mathClamp(prev + numberOfScrolls * incrementChange, 1, count)
      );
    },
    [incrementChange, count, setLimit]
  );

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case "Enter":
          setIsEditing(true);
          break;
        case "ArrowUp":
          e.preventDefault();
          setLimit((prev) => mathClamp(prev + incrementChange, 1, count));
          break;
        case "ArrowDown":
          e.preventDefault();
          setLimit((prev) => mathClamp(prev - incrementChange, 1, count));
          break;
      }
    },
    [incrementChange, count, setLimit]
  );

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Wrapper tabIndex={0} onKeyDown={handleKeyDown} onWheel={handleWheel}>
      {!isEditing ? (
        <Viewing onClick={() => setIsEditing(true)}>
          {limit} of {count}
        </Viewing>
      ) : (
        <Flex>
          <Input
            ref={inputRef}
            name="update-limit"
            value={limit}
            maxLength={4}
            autoComplete="off"
            onBlur={handleSetLimit}
            onKeyDown={(e) => {
              e.stopPropagation();
              switch (e.key) {
                case "Enter":
                  handleSetLimit();
                  break;
                case "Escape":
                  setIsEditing(false);
                  break;
              }
            }}
          />
          <Viewing> of {count}</Viewing>
        </Flex>
      )}
    </Wrapper>
  );
};
