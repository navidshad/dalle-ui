export type CanvasElementType = "image" | "mask";

/**
 * a base class for all canvas elements
 */
export class CanvasElement {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;

  static isImage(element: CanvasElement): element is ImageCanvaseElement {
    return element.type === "image";
  }

  static isMask(element: CanvasElement) {
    return element.type === "mask";
  }

  constructor(
    id: string,
    type: CanvasElementType,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

/**
 * a class for image canvas elements
 */
export class ImageCanvaseElement extends CanvasElement {
  src: string;

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    src: string
  ) {
    super(id, "image", x, y, width, height);
    this.src = src;
  }
}
