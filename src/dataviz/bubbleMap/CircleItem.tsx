import { useSpring, animated } from "@react-spring/web";

type CircleItemProps = {
  x: number;
  y: number;
  color: string;
};

export const CircleItem = ({ x, y, color }: CircleItemProps) => {
  const springProps = useSpring({
    from: {
      r: 4,
    },
    to: {
      r: 10,
      x,
      y,
      color,
    },
    config: {
      friction: 10,
    },
  });

  return (
    <g>
      <animated.circle
        cy={springProps.y}
        cx={springProps.x}
        opacity={0.7}
        stroke={springProps.color}
        fill={springProps.color}
        strokeWidth={1}
        r={springProps.r}
      />
    </g>
  );
};
