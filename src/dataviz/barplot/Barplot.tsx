import { GenderPayGapItem, allIslandNames } from "@/lib/types";
import { islandColorScale } from "@/lib/utils";
import { scaleBand, scaleLinear } from "d3-scale";
import { useMemo, useState } from "react";
import { InteractionData, Tooltip } from "./Tooltip";
import { AXIS_COLOR, AXIS_FONT_SIZE } from "../constant";
import { toast, useToast } from "@/components/ui/use-toast";

const MARGIN = { top: 60, right: 30, bottom: 80, left: 100 };

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
  const [isProTipAllowed, setIsProTipAllowed] = useState(true);

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
            opacity={hovered ? 0.1 : 1}
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
            r={hovered ? (hovered.name === d.Occupation ? 6 : 1) : 4}
            opacity={hovered ? (hovered.name === d.Occupation ? 1 : 0.05) : 0.7}
            stroke={islandColorScale(d.Location)}
            fill={islandColorScale(d.Location)}
            fillOpacity={
              hovered ? (hovered.name === d.Occupation ? 1 : 0.05) : 0.7
            }
            strokeWidth={1}
            rx={1}
            onMouseEnter={() => {
              setHovered({
                xPos: xScale(d.OBS_VALUE),
                yPos: y + yScale.bandwidth() / 2,
                name: d.Occupation,
              });
              if (isProTipAllowed) {
                toast({
                  title: "Pro Tip",
                  description:
                    "When you hover over a circle, all circles representing the same occupation group are highlighted.",
                });
              }
              setIsProTipAllowed(false);
            }}
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
          opacity={0.8}
        >
          {value}
        </text>
      </g>
    ));

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

  const topAnnotations = (
    <>
      <text
        x={boundsWidth}
        y={-10}
        fill={"black"}
        fontSize={15}
        fontWeight={300}
        textAnchor="end"
      >
        Women earn more
      </text>
      <text x={0} y={-10} fill={"black"} fontSize={15} fontWeight={300}>
        Women earn less
      </text>
    </>
  );

  const yAxisTitle = allIslandNames.map((islandName, i) => {
    return (
      <text
        key={i}
        x={20}
        y={yScale(islandName) + yScale.bandwidth() / 2}
        fill={islandColorScale(islandName)}
        fontSize={15}
        textAnchor="end"
        alignmentBaseline="middle"
        opacity={0.3}
      >
        {islandName}
      </text>
    );
  });

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
          {xAxisTitle}
          {yAxisTitle}
          {topAnnotations}
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
