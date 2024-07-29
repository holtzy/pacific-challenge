import {
  AgeGroup,
  EducationLevel,
  EducationLevelItem,
  Island,
  Sex,
  allEducationLevels,
  allIslandNames,
} from "@/lib/types";
import { educationLevelItems, sexColorScale } from "@/lib/utils";
import { extent } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { useMemo } from "react";

const MARGIN = { top: 30, right: 30, bottom: 30, left: 150 };
const BAR_PADDING = 0.3;

type LollipopProps = {
  width: number;
  height: number;
  data: EducationLevelItem[];
};

export const Lollipop = ({ width, height, data }: LollipopProps) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis is for groups since the barplot is horizontal
  const yScale = useMemo(() => {
    return scaleBand()
      .domain(allEducationLevels)
      .range([0, boundsHeight])
      .padding(BAR_PADDING);
  }, [data, height]);

  // X axis
  const xScale = useMemo(() => {
    const [min, max] = extent(data.map((d) => d.count));
    return scaleLinear()
      .domain([0, max || 10])
      .range([0, boundsWidth]);
  }, [data, width]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const y = yScale(d.level);

    if (y === undefined) {
      return null;
    }

    return (
      <g key={i}>
        <circle
          cx={xScale(d.count)}
          cy={yScale(d.level)}
          r={3}
          opacity={0.7}
          stroke={sexColorScale(d.sex)}
          fill={sexColorScale(d.sex)}
          fillOpacity={0.3}
          strokeWidth={1}
        />
        {/* <text
          x={xScale(d.value) - 7}
          y={y + yScale.bandwidth() / 2}
          textAnchor="end"
          alignmentBaseline="central"
          fontSize={12}
          opacity={xScale(d.value) > 90 ? 1 : 0} // hide label if bar is not wide enough
        >
          {d.value}
        </text> */}
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
          fill="#808080"
          opacity={0.8}
        >
          {value}
        </text>
      </g>
    ));

  const yAxis = allEducationLevels.map((ed) => {
    const label = educationLevelItems.find((e) => e.value === ed)?.label;

    return (
      <text
        x={xScale(0) - 10}
        y={yScale(ed)}
        fill={"black"}
        textAnchor="end"
        alignmentBaseline="central"
        fontSize={12}
      >
        {label}
      </text>
    );
  });

  return (
    <div>
      <svg width={width} height={height} overflow={""}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {grid}
          {yAxis}
          {allShapes}
        </g>
      </svg>
    </div>
  );
};