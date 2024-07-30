import { EmploymentRateItem } from "@/lib/types";
import { sexColorScale } from "@/lib/utils";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { useRef } from "react";
import { CircleItem } from "./CircleItem";
import { AXIS_COLOR, AXIS_FONT_SIZE } from "../constant";
import { LineItem } from "./LineItem";

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
  const maxYear = Math.max(...data.map((item) => item.TIME_PERIOD));
  const xScale = scaleLinear().domain([2011, 2021]).range([0, boundsWidth]);

  // Build the line
  const lineBuilder = line<EmploymentRateItem>()
    .x((d) => xScale(d.TIME_PERIOD))
    .y((d) => yScale(d.OBS_VALUE));

  const linePathMale = lineBuilder(data.filter((d) => d.Sex === "Male"));
  const linePathFemale = lineBuilder(data.filter((d) => d.Sex === "Female"));

  // Circles
  const allCircles = data.map((d, i) => {
    return (
      <>
        <CircleItem
          key={i}
          x={xScale(d.TIME_PERIOD)}
          y={yScale(d.OBS_VALUE)}
          color={sexColorScale(d.Sex)}
        />
        {d.TIME_PERIOD === maxYear && (
          <text
            x={xScale(d.TIME_PERIOD) + 20}
            y={yScale(d.OBS_VALUE)}
            fill={sexColorScale(d.Sex)}
            alignmentBaseline="middle"
            fontSize={12}
          >
            {d.Sex}
          </text>
        )}
      </>
    );
  });

  const grid = xScale.ticks(6).map((value, i) => (
    <g key={i}>
      <line
        x1={xScale(value)}
        x2={xScale(value)}
        y1={boundsHeight}
        y2={boundsHeight + 4}
        stroke={AXIS_COLOR}
        opacity={0.2}
        shapeRendering="crispEdges"
      />
      <text
        x={xScale(value)}
        y={boundsHeight + 10}
        textAnchor="middle"
        alignmentBaseline="central"
        fontSize={AXIS_FONT_SIZE}
        fill={AXIS_COLOR}
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
        stroke={AXIS_COLOR}
        opacity={0.2}
        shapeRendering="crispEdges"
      />
      <text
        x={-20}
        y={yScale(value)}
        textAnchor={"middle"}
        alignmentBaseline="central"
        fontSize={AXIS_FONT_SIZE}
        fill={AXIS_COLOR}
        opacity={1}
      >
        {value}
      </text>
    </g>
  ));

  const xAxisTitle = (
    <>
      <text
        x={boundsWidth - 10}
        y={boundsHeight + 40}
        fill={AXIS_COLOR}
        fontSize={AXIS_FONT_SIZE}
      >
        Year
      </text>
    </>
  );

  const yAxisTitle = (
    <>
      <text
        x={-45}
        y={30}
        fill={AXIS_COLOR}
        fontSize={AXIS_FONT_SIZE}
        textAnchor="end"
      >
        Number of employed
      </text>
      <text
        x={-45}
        y={45}
        fill={AXIS_COLOR}
        fontSize={AXIS_FONT_SIZE}
        textAnchor="end"
      >
        persons
      </text>
    </>
  );

  return (
    <div>
      <svg width={width} height={height} overflow="visible">
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {grid}
          {yGrid}
          {xAxisTitle}
          {yAxisTitle}
          <LineItem
            path={linePathMale}
            opacity={1}
            color={sexColorScale("Male")}
          />
          <LineItem
            path={linePathFemale}
            opacity={1}
            color={sexColorScale("Female")}
          />

          {allCircles}
        </g>
      </svg>
    </div>
  );
};
