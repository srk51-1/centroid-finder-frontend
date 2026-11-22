import { useEffect, useRef, useState } from "react";
import { Alert, Box, Stack, Typography } from "@mui/material";
import findLargestGroup from "../utils/findLargestGroup";

export default function ImageComparison({
  filename,
  targetColor,
  threshold,
}) {
  const [pixels, setPixels] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  function loadPixels(event) {
    try {
      const image = event.currentTarget;
      const canvas = document.createElement("canvas");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);

      setPixels(
        context.getImageData(0, 0, canvas.width, canvas.height)
      );
    } catch {
      setError("Could not read the thumbnail pixels.");
    }
  }

  useEffect(() => {
    if (!pixels) return;

    const canvas = canvasRef.current;
    canvas.width = pixels.width;
    canvas.height = pixels.height;

    const context = canvas.getContext("2d");
    const result = context.createImageData(pixels.width, pixels.height);

    const binary = Array.from(
      { length: pixels.height },
      () => new Uint8Array(pixels.width)
    );

    const red = parseInt(targetColor.slice(1, 3), 16);
    const green = parseInt(targetColor.slice(3, 5), 16);
    const blue = parseInt(targetColor.slice(5, 7), 16);

    for (let row = 0; row < pixels.height; row++) {
      for (let column = 0; column < pixels.width; column++) {
        const i = (row * pixels.width + column) * 4;

        const redDifference = pixels.data[i] - red;
        const greenDifference = pixels.data[i + 1] - green;
        const blueDifference = pixels.data[i + 2] - blue;

        const distance = Math.sqrt(
          redDifference ** 2 +
          greenDifference ** 2 +
          blueDifference ** 2
        );

        const match = distance < threshold;
        binary[row][column] = match ? 1 : 0;

        const value = match ? 255 : 0;
        result.data[i] = value;
        result.data[i + 1] = value;
        result.data[i + 2] = value;
        result.data[i + 3] = 255;
      }
    }

    context.putImageData(result, 0, 0);

    const largest = findLargestGroup(binary);

    if (largest) {
      context.beginPath();
      context.arc(largest.x, largest.y, 6, 0, Math.PI * 2);
      context.fillStyle = "#ff3030";
      context.fill();
      context.strokeStyle = "#00ff00";
      context.lineWidth = 2;
      context.stroke();
    }
  }, [pixels, targetColor, threshold]);

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography gutterBottom>Original frame</Typography>

          <Box
            component="img"
            src={`/thumbnail/${encodeURIComponent(filename)}`}
            alt={`First frame of ${filename}`}
            onLoad={loadPixels}
            onError={() => setError("Could not load the thumbnail.")}
            sx={{
              width: "100%",
              display: "block",
              borderRadius: 2,
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography gutterBottom>Color matches</Typography>

          <Box
            component="canvas"
            ref={canvasRef}
            role="img"
            aria-label="Color matches with the largest group's centroid"
            sx={{
              width: "100%",
              display: "block",
              borderRadius: 2,
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}