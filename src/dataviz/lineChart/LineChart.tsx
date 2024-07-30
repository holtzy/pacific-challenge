import { EmploymentRateItem } from "@/lib/types";
import { sexColorScale } from "@/lib/utils";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { useRef } from "react";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type LineChartProps = {
  width: number;
  height: number;
  data: EmploymentRateItem[];
};

export const LineChart = ({ width, height, data }: LineChartProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis
  const max = Math.max(...data.map((item) => item.OBS_VALUE));
  const yScale = scaleLinear()
    .domain([0, max * 1.2])
    .range([boundsHeight, 0]);

  // X axis
  const xScale = scaleLinear().domain([2011, 2021]).range([0, boundsWidth]);

  // Build the line
  const lineBuilder = line<EmploymentRateItem>()
    .x((d) => xScale(d.TIME_PERIOD))
    .y((d) => yScale(d.OBS_VALUE));

  const linePathMale = lineBuilder(data.filter((d) => d.Sex === "Male"));
  const linePathFemale = lineBuilder(data.filter((d) => d.Sex === "Female"));

  // Circles
  const allCircles = data.map((d) => {
    return (
      <circle
        cx={xScale(d.TIME_PERIOD)}
        cy={yScale(d.OBS_VALUE)}
        r={3}
        fill={sexColorScale(d.Sex)}
      />
    );
  });

  const grid = xScale.ticks(6).map((value, i) => (
    <g key={i}>
      <line
        x1={xScale(value)}
        x2={xScale(value)}
        y1={boundsHeight}
        y2={boundsHeight + 4}
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

  const yGrid = yScale.ticks(4).map((value, i) => (
    <g key={i}>
      <line
        x1={0}
        x2={boundsWidth}
        y1={yScale(value)}
        y2={yScale(value)}
        stroke="#808080"
        opacity={0.2}
      />
      <text
        x={-20}
        y={yScale(value)}
        textAnchor={"middle"}
        alignmentBaseline="central"
        fontSize={9}
        fill="black"
        opacity={1}
      >
        {value}
      </text>
    </g>
  ));

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {grid}
          {yGrid}
          <path
            d={linePathMale}
            opacity={1}
            stroke={sexColorScale("Male")}
            fill="none"
            strokeWidth={2}
          />
          <path
            d={linePathFemale}
            opacity={1}
            stroke={sexColorScale("Female")}
            fill="none"
            strokeWidth={2}
          />
          {allCircles}
        </g>
      </svg>
    </div>
  );
};
