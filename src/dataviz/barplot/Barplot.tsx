import { GenderPayGapItem, allIslandNames } from "@/lib/types";
import { islandColorScale } from "@/lib/utils";
import { scaleBand, scaleLinear } from "d3-scale";
import { useMemo, useState } from "react";
import { InteractionData, Tooltip } from "./Tooltip";

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };

type BarplotProps = {
  width: number;
  height: number;
  data: GenderPayGapItem[];
};

export const Barplot = ({ width, height, data }: BarplotProps) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hovered, setHovered] = useState<InteractionData | null>(null);

  // Y axis is for groups since the barplot is horizontal;
  const yScale = useMemo(() => {
    return scaleBand()
      .domain(allIslandNames)
      .range([0, boundsHeight])
      .padding(0.1);
  }, [data, height]);

  // X axis
  const xScale = useMemo(() => {
    return scaleLinear().domain([0, 2]).range([0, boundsWidth]);
  }, [data, width]);

  const allRects = data
    .filter((d) => d.Occupation === "All occupations")
    .map((d, i) => {
      const y = yScale(d.Location);

      if (y === undefined) {
        return null;
      }

      return (
        <g key={i}>
          <rect
            x={d.OBS_VALUE > 1 ? xScale(1) : xScale(d.OBS_VALUE)}
            y={yScale(d.Location)}
            width={
              d.OBS_VALUE > 1
                ? xScale(d.OBS_VALUE) - xScale(1)
                : xScale(1) - xScale(d.OBS_VALUE)
            }
            height={yScale.bandwidth()}
            opacity={0.7}
            stroke={islandColorScale(d.Location)}
            fill={islandColorScale(d.Location)}
            fillOpacity={0.8}
            strokeWidth={1}
            rx={1}
          />
        </g>
      );
    });

  const allCircles = data
    .filter((d) => d.Occupation !== "All occupations")
    .map((d, i) => {
      const y = yScale(d.Location);

      if (y === undefined) {
        return null;
      }

      return (
        <g key={i}>
          <circle
            cx={xScale(d.OBS_VALUE)}
            cy={y + yScale.bandwidth() / 2}
            r={4}
            opacity={0.7}
            stroke={islandColorScale(d.Location)}
            fill={islandColorScale(d.Location)}
            fillOpacity={0.3}
            strokeWidth={1}
            rx={1}
            onMouseEnter={() =>
              setHovered({
                xPos: xScale(d.OBS_VALUE),
                yPos: y + yScale.bandwidth() / 2,
                name: d.Occupation,
              })
            }
            onMouseLeave={() => setHovered(null)}
            cursor={"pointer"}
          />
        </g>
      );
    });

  const grid = xScale
    .ticks(5)
    .slice(1)
    .map((value, i) => (
      <g key={i}>
        <line
          x1={xScale(value)}
          x2={xScale(value)}
          y1={0}
          y2={boundsHeight}
          stroke="#808080"
          opacity={0.2}
        />
        <text
          x={xScale(value)}
          y={boundsHeight + 10}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={9}
          stroke="#808080"
          opacity={0.8}
        >
          {value}
        </text>
      </g>
    ));

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {grid}
          {allRects}
          {allCircles}
        </g>
      </svg>

      {/* Tooltip */}
      <div
        style={{
          width: boundsWidth,
          height: boundsHeight,
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          marginLeft: MARGIN.left,
          marginTop: MARGIN.top,
        }}
      >
        <Tooltip interactionData={hovered} />
      </div>
    </div>
  );
};
