import { Direction, UNIT_THEME } from "@/constants/Constants";
import { Point } from "@/model/Point";

export function isAdjacent(center: Point, otherField: Point): Direction | null {
  if (center.x === otherField.x && center.y === otherField.y + 1) {
    return Direction.UP;
  }
  if (center.x === otherField.x && center.y === otherField.y - 1) {
    return Direction.DOWN;
  }
  if (center.x === otherField.x + 1 && center.y === otherField.y) {
    return Direction.LEFT;
  }
  if (center.x === otherField.x - 1 && center.y === otherField.y) {
    return Direction.RIGHT;
  }

  return null;
}

export function invertDirection(direction: Direction): Direction {
  switch (direction) {
    case Direction.RIGHT:
      return Direction.LEFT;
    case Direction.LEFT:
      return Direction.RIGHT;
    case Direction.UP:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.UP;
  }
}

export function directionToImg(direction: Direction): JSX.Element {
  const src = `/assets/img/${UNIT_THEME}/arrow_${direction}.gif`;
  return <img alt={`arrow ${direction.toLowerCase()}`} src={src} />;
}
