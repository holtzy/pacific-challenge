"use client";

import { Island } from "@/lib/types";
import { islandColorScale, islandCoordinates } from "@/lib/utils";
import { geoOrthographic, geoPath } from "d3-geo";
import { FeatureCollection } from "geojson";
import { CircleItem } from "./CircleItem";

import styles from "./bubble-map.module.css";
import { useRef } from "react";

type BubbleMapProps = {
  width: number;
  height: number;
  data: FeatureCollection;
  selectedIsland: Island | undefined;
  setSelectedIsland: (newIsland: Island) => void;
  scale: number;
  bubbleSize: number;
};

export const BubbleMap = ({
  width,
  height,
  data,
  selectedIsland,
  setSelectedIsland,
  scale,
  bubbleSize,
}: BubbleMapProps) => {
  console.log("width", width);
  const bubbleContainerRef = useRef(null);

  const projection = geoOrthographic()
    .rotate([200, 5])
    .scale(scale)
    .translate([width / 2, height / 2]);

  const geoPathGenerator = geoPath().projection(projection);

  const allSvgPaths = data.features
    .filter((shape) => shape.id !== "ATA")
    .map((shape) => {
      return (
        <path
          key={shape.id}
          d={geoPathGenerator(shape)}
          stroke="lightGrey"
          strokeWidth={0.5}
          fill="grey"
          fillOpacity={0.7}
        />
      );
    });

  //
  //
  // ALL ISLAND
  //
  //
  const allBubbles = islandCoordinates.map((island) => {
    const [x, y] = projection(island.coordinates);

    const color =
      selectedIsland === island.name || !selectedIsland
        ? islandColorScale(island.name)
        : "black";

    const r =
      selectedIsland === island.name || !selectedIsland
        ? bubbleSize * 2
        : bubbleSize;

    return (
      <g className={styles.circleContainer} key={island.name}>
        <CircleItem
          x={x}
          y={y}
          r={r}
          color={color}
          onClick={() => {
            setSelectedIsland(island.name);
          }}
        />
        <text
          className={styles.circleText}
          x={x < width - 100 ? x + r + 5 : x - r - 5}
          y={y}
          fill={color}
          alignmentBaseline="middle"
          textAnchor={x < width - 100 ? "start" : "end"}
        >
          {island.name}
        </text>
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        {allSvgPaths}
        <g
          ref={bubbleContainerRef}
          onMouseOver={() => {
            if (bubbleContainerRef.current) {
              bubbleContainerRef.current.classList.add(styles.hasHighlight);
            }
          }}
          onMouseLeave={() => {
            if (bubbleContainerRef.current) {
              bubbleContainerRef.current.classList.remove(styles.hasHighlight);
            }
          }}
        >
          {allBubbles}
        </g>
      </svg>
    </div>
  );
};
