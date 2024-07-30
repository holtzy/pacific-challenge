import { useSpring, animated } from "@react-spring/web";

type LineItemProps = {
  path: string;
  color: string;
  opacity: number;
};

export const LineItem = ({ path, color, opacity }: LineItemProps) => {
  const springProps = useSpring({
    to: {
      path,
      color,
      opacity,
    },
    config: {
      friction: 5,
      tension: 15, // Lower tension will reduce bounce
    },
  });

  return (
    <animated.path
      d={path}
      fill={"none"}
      stroke={springProps.color}
      strokeWidth={2}
      opacity={springProps.opacity}
    />
  );
};
