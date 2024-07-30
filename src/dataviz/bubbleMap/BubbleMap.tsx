import { Island } from "@/lib/types";
import { islandColorScale, islandCoordinates } from "@/lib/utils";
import { geoMercator, geoOrthographic, geoPath } from "d3-geo";
import { FeatureCollection } from "geojson";
import { CircleItem } from "./CircleItem";

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

    return (
      <CircleItem
        key={island.name}
        x={x}
        y={y}
        r={selectedIsland === island.name ? bubbleSize * 2 : bubbleSize}
        color={color}
        onClick={() => {
          setSelectedIsland(island.name);
        }}
      />
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        {allSvgPaths}
        {allBubbles}
      </svg>
    </div>
  );
};
