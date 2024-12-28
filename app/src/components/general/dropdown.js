import { h } from "preact";
import { useCallback, useState, useRef, useEffect } from "preact/hooks";
import { FiChevronDown } from "react-icons/fi";
import styled from "styled-components";

const DropdownBase = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: flex-end;
`;

const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid transparent;
  outline: none;
  border-radius: 5px;
  padding: 3px 0;

  &:focus-visible {
    border-color: #484848;
  }
`;

const DropdownMenu = styled.div`
  background-color: #1f1f1f;
  box-sizing: border-box;
  max-height: 200px;
  overflow-y: auto;
  position: absolute;
  top: 110%;
  width: 100%;
  z-index: 100;
  border-radius: 5px;

  ${(props) => (props.alignment === "right" ? `right: 0;` : `left: 0;`)}

  ${(props) =>
    props.minWidth &&
    `
    min-width: ${props.minWidth}px;
  `}
`;

const DropdownOption = styled.div`
  box-sizing: border-box;
  color: white;
  cursor: pointer;
  display: block;
  padding: 5px 10px;
  margin: 5px 5px;
  border-radius: 5px;
  user-select: none;
  &:hover {
    background: #2b2b2b;
  }

  ${(props) =>
    props.fs &&
    `
    font-size: ${props.fs}rem;
  `}

  ${(props) =>
    props.isSelected &&
    `
      background: #2b2b2b;
    
  `}
`;

const ChevronDown = styled(FiChevronDown)`
  margin-left: 5px;
`;

export const Dropdown = ({
  value,
  setValue,
  options,
  minWidth,
  alignment = "left",
  optionFontSize,
  className,
}) => {
  const [isOpen, _setIsOpen] = useState(false);

  const dropdownRef = useRef();
  const controlRef = useRef();

  const [selectedRow, _setSelectedRow] = useState(0);

  const selectedRowRef = useRef(selectedRow);
  const isOpenRef = useRef(isOpen);

  const setSelectedRow = (data) => {
    selectedRowRef.current = data;
    _setSelectedRow(data);
  };

  const setIsOpen = (data) => {
    isOpenRef.current = data;
    _setIsOpen(data);
  };

  const clickListener = useCallback((e) => {
    if (!dropdownRef.current.contains(e.target)) setIsOpen(false);
  }, []);

  const keydownListener = useCallback(
    (e) => {
      if (!options.length) return;
      if (
        (isOpen || controlRef.current === document.activeElement) &&
        (e.code === "ArrowDown" || e.code === "ArrowUp" || e.code === "Enter")
      )
        e.preventDefault();

      if (e.code === "ArrowDown") {
        if (selectedRowRef.current < options.length - 1) {
          setSelectedRow(selectedRowRef.current + 1);
          if (
            !isOpenRef.current &&
            controlRef.current === document.activeElement
          ) {
            setValue(options[selectedRowRef.current].value);
          }
        }
      } else if (e.code === "ArrowUp") {
        if (selectedRowRef.current !== 0) {
          setSelectedRow(selectedRowRef.current - 1);
          if (
            !isOpenRef.current &&
            controlRef.current === document.activeElement
          ) {
            setValue(options[selectedRowRef.current].value);
          }
        }
      }

      if (
        (e.code === "ArrowDown" || e.code === "ArrowUp") &&
        isOpenRef.current
      ) {
        document.querySelector("#options").scrollTo({
          top: 37 * selectedRowRef.current,
          // top: 37 * (selectedRowRef.current - 9),
        });
      }

      if (e.code === "Enter") {
        if (isOpenRef.current) {
          setValue(options[selectedRowRef.current].value);
          setIsOpen(false);
        } else if (controlRef.current === document.activeElement) {
          setIsOpen(true);
        }
      }
    },
    [isOpen, options, setValue]
  );

  useEffect(() => {
    window.addEventListener("click", clickListener);
    window.addEventListener("touchend", clickListener);
    window.addEventListener("keydown", keydownListener);
    return () => {
      window.removeEventListener("click", clickListener);
      window.removeEventListener("touchend", clickListener);
      window.removeEventListener("keydown", keydownListener);
    };
  }, [clickListener, keydownListener]);

  const handleMouseDown = useCallback(
    (value, index) => {
      setValue(value);
      setSelectedRow(index);
      setIsOpen(false);
    },
    [setValue]
  );

  return (
    <DropdownBase ref={dropdownRef} className={className}>
      <DropdownWrapper
        tabIndex={0}
        role="listbox"
        aria-expanded={isOpen}
        aria-label="Select anime category"
        onClick={() => setIsOpen((prev) => !prev)}
        ref={controlRef}
      >
        <div role="option">{options.find((e) => e.value === value)?.label}</div>
        <ChevronDown />
      </DropdownWrapper>
      {isOpen && (
        <DropdownMenu
          id="options"
          className="dropdownMenu"
          minWidth={minWidth}
          alignment={alignment}
        >
          {options.map((option, i) => (
            <DropdownOption
              onClick={() => {
                handleMouseDown(option.value, i);
              }}
              role="option"
              isSelected={selectedRow === i}
              key={i}
              className="dropdownOption"
              onMouseOver={() => setSelectedRow(i)}
              fs={optionFontSize}
            >
              {option.label}
            </DropdownOption>
          ))}
        </DropdownMenu>
      )}
    </DropdownBase>
  );
};
