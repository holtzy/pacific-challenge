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
};

export const BubbleMap = ({
  width,
  height,
  data,
  selectedIsland,
  setSelectedIsland,
}: BubbleMapProps) => {
  const projection = geoOrthographic()
    .rotate([200, 5])
    .scale(200)
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

  const allBubbles = islandCoordinates.map((island) => {
    const [x, y] = projection(island.coordinates);

    const color = selectedIsland ? "grey" : islandColorScale(island.name);

    if (island.name === selectedIsland) {
      return null;
    }

    return (
      <circle
        key={island.name}
        cx={x}
        cy={y}
        r={selectedIsland === island.name ? 10 : 6}
        fill={color}
        fillOpacity={0.4}
        stroke={color}
        onClick={() => {
          setSelectedIsland(island.name);
        }}
        cursor={"pointer"}
      />
    );
  });

  const selectedIslandItem = islandCoordinates.find(
    (island) => island.name === selectedIsland
  );
  const selectedCoord = projection(selectedIslandItem.coordinates);

  const selectedBubble = (
    <CircleItem
      x={selectedCoord[0]}
      y={selectedCoord[1]}
      r={10}
      color={islandColorScale(selectedIsland)}
      onClick={() => {
        setSelectedIsland(island.name);
      }}
      cursor={"pointer"}
    />
  );

  return (
    <div>
      <svg width={width} height={height}>
        {allSvgPaths}
        {allBubbles}
        {selectedBubble}
      </svg>
    </div>
  );
};
