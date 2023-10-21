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

  constructor(detail: {
    x: number;
    y: number;
    width: number;
    height: number;
    src: string;
  }) {
    const id =
      "image-" + new Date().getTime() + Math.random().toString(36).substring(7);

    super(id, "image", detail.x, detail.y, detail.width, detail.height);

    this.src = detail.src;
  }
}
