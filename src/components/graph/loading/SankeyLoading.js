import { h } from "preact";
import { useEffect, useMemo, useRef } from "preact/hooks";
import styled from "styled-components";
import { select, interpolateNumber } from "d3";
import { getNodeColour } from "../sankeyFunctions";

const STROKE_WIDTH = 40;

const Wrapper = styled.div`
  width: ${(props) => props.w ?? 90}%;
  height: ${(props) => props.h ?? 50}vh;
  margin: 0 auto;

  & .loading-chord {
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    animation: dash 1s linear forwards;
  }

  @keyframes dash {
    from {
      stroke-dashoffset: 1822;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
`;

const generatePathId = () => Math.floor(Math.random() * 1000000000);

const generatePath = (x, y) => {
  const curvature = 0.6;
  const padding = STROKE_WIDTH / 2;

  const x0 = 0,
    x1 = x,
    xi = interpolateNumber(x0, x1),
    x2 = xi(curvature),
    x3 = xi(1 - curvature),
    y0 = padding + Math.floor(Math.random() * (y - STROKE_WIDTH)),
    y1 = padding + Math.floor(Math.random() * (y - STROKE_WIDTH));

  return Math.random() > 0.5
    ? `M${x0},${y0}C${x2},${y0} ${x3},${y1} ${x1},${y1}`
    : `M${x1},${y1}C${x3},${y1} ${x2},${y0} ${x0},${y0}`;
};

export const SankeyLoading = ({
  customDimensions,
  hasColor = false,
  startFresh = false,
}) => {
  let svgRef = useRef();

  const opacityStart = useMemo(() => (hasColor ? "0.7" : "1"), [hasColor]);

  useEffect(() => {
    let loadedTimeout;

    if (!startFresh) {
      for (let i = 0; i < 5; i++) {
        const id = generatePathId();

        let g = select(svgRef.current)
          .append("g")
          .attr("class", "loaded-chord");
        let linearGradient = g.append("linearGradient").attr("id", id);

        linearGradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "rgb(24, 24, 24)")
          .append("animate")
          .attr("attributeName", "stop-color")
          .attr("values", "rgb(24, 24, 24); rgb(30, 30, 30); rgb(24, 24, 24);")
          .attr("dur", "1s")
          .attr("repeatCount", "indefinite");

        linearGradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "rgb(30, 30, 30)")
          .append("animate")
          .attr("attributeName", "stop-color")
          .attr("values", "rgb(30, 30, 30); rgb(24, 24, 24); rgb(30, 30, 30);")
          .attr("dur", "1s")
          .attr("repeatCount", "indefinite");

        g.append("path")
          .attr(
            "d",
            generatePath(
              svgRef.current.clientWidth,
              svgRef.current.clientHeight
            )
          )
          .attr(
            "stroke",
            hasColor
              ? getNodeColour(Math.floor(Math.random() * 10000000).toString())
              : `url('#${id}')`
          )
          .attr("stroke-width", STROKE_WIDTH)
          .attr("fill", "none")
          .attr("opacity", opacityStart)
          .append("animate")
          .attr("attributeName", "opacity")
          .attr("id", generatePathId())
          .attr("dur", `${700 * (i + 1)}ms`)
          .attr("values", `${opacityStart}; ${`${opacityStart}; `.repeat(i)}0;`)
          .attr("fill", "freeze");
      }

      loadedTimeout = setTimeout(() => {
        Array.from(document.querySelectorAll(".loaded-chord")).forEach((el) =>
          el.remove()
        );
      }, [3500]);
    }

    return () => clearTimeout(loadedTimeout);
  }, [startFresh, hasColor, opacityStart]);

  useEffect(() => {
    let pathAnimation;
    let pathRemovals = [];
    let counter = 0;

    pathAnimation = setInterval(() => {
      const id = generatePathId();

      let linearGradient = select(svgRef.current)
        .append("linearGradient")
        .attr("id", id);

      linearGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgb(24, 24, 24)")
        .append("animate")
        .attr("attributeName", "stop-color")
        .attr("values", "rgb(24, 24, 24); rgb(30, 30, 30); rgb(24, 24, 24);")
        .attr("dur", "1s")
        .attr("repeatCount", "indefinite");

      linearGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgb(30, 30, 30)")
        .append("animate")
        .attr("attributeName", "stop-color")
        .attr("values", "rgb(30, 30, 30); rgb(24, 24, 24); rgb(30, 30, 30);")
        .attr("dur", "1s")
        .attr("repeatCount", "indefinite");

      select(svgRef.current)
        .append("path")
        .attr(
          "d",
          generatePath(svgRef.current.clientWidth, svgRef.current.clientHeight)
        )
        .attr("class", "loading-chord")
        .attr(
          "stroke",
          hasColor
            ? getNodeColour(Math.floor(Math.random() * 10000000).toString())
            : `url('#${id}')`
        )
        .attr("stroke-width", STROKE_WIDTH)
        .attr("fill", "none")
        .attr("opacity", opacityStart)
        .append("animate")
        .attr("attributeName", "opacity")
        .attr("id", generatePathId())
        .attr("dur", `${4200 + 700 * counter}ms`)
        .attr(
          "values",
          `${`${opacityStart}; `.repeat(4)}${`${opacityStart}; `.repeat(
            counter
          )}0;`
        )
        .attr("fill", "freeze");

      counter++;

      pathRemovals.push(
        setTimeout(() => {
          pathRemovals.shift();
          document.querySelectorAll(".loading-chord")[0]?.remove();
          document.getElementById(id)?.remove();
        }, 3500)
      );
    }, 700);

    return () => {
      clearInterval(pathAnimation);
      pathRemovals.forEach((pathRemoval) => clearTimeout(pathRemoval));
    };
  }, [hasColor, opacityStart]);

  return (
    <Wrapper w={customDimensions?.width} h={customDimensions?.height}>
      <Svg ref={svgRef} />
    </Wrapper>
  );
};
