import { Island } from "@/lib/types";
import { islandCoordinates } from "@/lib/utils";
import { geoMercator, geoOrthographic, geoPath } from "d3-geo";
import { FeatureCollection } from "geojson";

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

    const color = selectedIsland
      ? selectedIsland === island.name
        ? "red"
        : "grey"
      : "blue";

    return (
      <circle
        key={island.name}
        cx={x}
        cy={y}
        r={10}
        fill={color}
        fillOpacity={0.1}
        stroke={color}
        onClick={() => {
          setSelectedIsland(island.name);
        }}
        cursor={"pointer"}
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
