import {Direction} from "../constants/Constants";

export const isAdjacent = (center, otherField) => {
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
}

export const pointEqual = (point1, point2) => {
    if(!point1 || !point2) {
        return false;
    }
    return point1.x === point2.x && point1.y === point2.y;
}
