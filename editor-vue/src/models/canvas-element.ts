export type CanvasElementType = "image" | "rectMask";

/**
 * A base class for all canvas elements
 */
export class CanvasElement {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  hidden: boolean = false;

  static isImage(element: CanvasElement): element is ImageCanvaseElement {
    return element.type === "image";
  }

  static isMask(element: CanvasElement) {
    return element.type === "rectMask";
  }

  constructor(detail: {
    id: string;
    type: CanvasElementType;
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    this.id = detail.id;
    this.type = detail.type;
    this.x = detail.x;
    this.y = detail.y;
    this.width = detail.width;
    this.height = detail.height;
  }
}

/**
 *  Image canvas elements
 */
export class ImageCanvaseElement extends CanvasElement {
  src: HTMLImageElement;
  isLoaded: boolean = false;

  static fromBase64Image(detail: {
    base64: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    return new Promise<ImageCanvaseElement>((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        resolve(
          new ImageCanvaseElement({
            x: detail.x,
            y: detail.y,
            width: detail.width,
            height: detail.height,
            src: image,
          })
        );
      };

      image.onerror = (e) => {
        reject(e);
      };

      image.src = `data:image/png;base64,${detail.base64}`;
    });
  }

  constructor(detail: {
    x: number;
    y: number;
    width: number;
    height: number;
    src: HTMLImageElement;
  }) {
    const id = "image-" + Math.random().toString(36).substring(7);

    super({
      id,
      type: "image",
      x: detail.x,
      y: detail.y,
      width: detail.width,
      height: detail.height,
    });

    this.src = detail.src;
  }
}
