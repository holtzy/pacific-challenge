import { EducationLevelItem, allEducationLevels } from "@/lib/types";
import { educationLevelItems, sexColorScale } from "@/lib/utils";
import { extent, max } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { useMemo } from "react";
import { DumbbellItem } from "./DumbbellItem";
import { AXIS_COLOR, AXIS_FONT_SIZE } from "../constant";

const MARGIN = { top: 30, right: 30, bottom: 30, left: 150 };

type LollipopProps = {
  width: number;
  height: number;
  data: EducationLevelItem[];
  title: string;
};

export const Lollipop = ({ width, height, data, title }: LollipopProps) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis is for groups since the barplot is horizontal
  const yScale = useMemo(() => {
    return scaleBand().domain(allEducationLevels).range([0, boundsHeight]);
  }, [data, height]);

  // X axis
  const xScale = useMemo(() => {
    const max = Math.max(...data.map((d) => Math.max(d.male, d.female)));

    return scaleLinear()
      .domain([0, max || 10])
      .range([0, boundsWidth]);
  }, [data, width]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const y = yScale(d.level) + yScale.bandwidth() / 2;

    if (y === undefined) {
      return null;
    }

    return (
      <DumbbellItem
        key={i}
        xValue1={xScale(d.male)}
        xValue2={xScale(d.female)}
        y={y}
      />
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

  const yAxis = allEducationLevels.map((ed, i) => {
    const label = educationLevelItems.find((e) => e.value === ed)?.label;

    return (
      <text
        key={i}
        x={xScale(0) - 10}
        y={yScale(ed) + yScale.bandwidth() / 2}
        fill={"black"}
        textAnchor="end"
        alignmentBaseline="central"
        fontSize={12}
      >
        {label}
      </text>
    );
  });

  const svgTitle = (
    <text
      x={boundsWidth}
      y={-10}
      fill={"black"}
      textAnchor="end"
      alignmentBaseline="central"
      fontSize={12}
    >
      {title}
    </text>
  );

  const xAxisTitle = (
    <>
      <text
        x={boundsWidth - 84}
        y={boundsHeight + 40}
        fill={AXIS_COLOR}
        fontSize={AXIS_FONT_SIZE}
      >
        Ratio of the gross earnings
      </text>
      <text
        x={boundsWidth - 84}
        y={boundsHeight + 52}
        fill={AXIS_COLOR}
        fontSize={AXIS_FONT_SIZE}
      >
        between women and men
      </text>
    </>
  );

  const sexAnnotationTarget = data.filter(
    (d) =>
      xScale(d.female) > boundsWidth / 4 &&
      xScale(d.male) > boundsWidth / 4 &&
      xScale(d.female) < (boundsWidth * 3) / 4 &&
      xScale(d.male) < (boundsWidth * 3) / 4
  )[0];
  const isMaleOver = sexAnnotationTarget?.male > sexAnnotationTarget?.female;
  const sexAnnotation = (
    <>
      <text
        x={xScale(sexAnnotationTarget?.male) + (isMaleOver ? 10 : -10)}
        y={yScale(sexAnnotationTarget?.level) + yScale.bandwidth() / 2}
        fill={sexColorScale("Male")}
        alignmentBaseline="middle"
        textAnchor={isMaleOver ? "start" : "end"}
        fontSize={12}
      >
        {"Male"}
      </text>
      <text
        x={xScale(sexAnnotationTarget?.female) + (isMaleOver ? -10 : +10)}
        y={yScale(sexAnnotationTarget?.level) + yScale.bandwidth() / 2}
        fill={sexColorScale("Female")}
        alignmentBaseline="middle"
        textAnchor={isMaleOver ? "end" : "start"}
        fontSize={12}
      >
        {"Female"}
      </text>
    </>
  );

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
          {svgTitle}
          {xAxisTitle}
          {sexAnnotation}
        </g>
      </svg>
    </div>
  );
};
