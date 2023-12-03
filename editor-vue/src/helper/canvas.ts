import { CanvasElement, ImageCanvaseElement } from "@/models/canvas-element";

export function drawImage(
  context: CanvasRenderingContext2D,
  element: ImageCanvaseElement
) {
  context.globalCompositeOperation = "source-over";

  context.drawImage(
    element.src,
    element.x,
    element.y,
    element.width,
    element.height
  );
}

export function drawRect(options: {
  context: CanvasRenderingContext2D;
  element: CanvasElement;
  fillStyle?: string;
  globalCompositeOperation?: GlobalCompositeOperation;
}) {
  const {
    context,
    element,
    fillStyle = "rgba(0, 0, 0, 0.5)",
    globalCompositeOperation = "source-over",
  } = options;

  context.globalCompositeOperation = globalCompositeOperation;

  context.beginPath();

  context.fillStyle = fillStyle;

  context.fillRect(element.x, element.y, element.width, element.height);

  context.stroke();
}

export function paint(options: {
  context: CanvasRenderingContext2D;
  maskPixel: number[];
  lineWidth?: number;
  strokeStyle?: any;
  globalCompositeOperation?: GlobalCompositeOperation;
}) {
  const {
    context,
    maskPixel,
    lineWidth = 30,
    strokeStyle = "black",
    globalCompositeOperation = "destination-out",
  } = options;

  // erease mode
  context.globalCompositeOperation = globalCompositeOperation;

  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.strokeStyle = strokeStyle;

  const [x, y] = maskPixel;
  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
  context.beginPath();
}

export function getBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      blob?.type === "image/png";
      resolve(blob);
    }, "image/png");
  });
}
