export class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isEqual(point: Point | null) {
    if (point == null) {
      return false;
    }

    return this.x === point.x && this.y === point.y;
  }

  public toString() {
    return `{${this.x + 1},${this.y + 1}}`;
  }
}
