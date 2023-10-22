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

export function drawRect(
  context: CanvasRenderingContext2D,
  element: CanvasElement
) {
  context.globalCompositeOperation = "destination-out";

  // draw a box
  context.beginPath();
  // color
  context.fillRect(element.x, element.y, element.width, element.height);
  context.stroke();
}

export function paint(
  context: CanvasRenderingContext2D,
  maskPixel: number[],
  lineWidth = 10,
  strokeStyle = "black"
) {
  // erease mode
  context.globalCompositeOperation = "destination-out";

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
    canvas.toBlob(resolve, "image/png");
  });
}
