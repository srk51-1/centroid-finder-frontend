import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import ImageComparison from "../components/ImageComparison";
import ProcessingJob from "../components/ProcessingJob";

export default function VideoPreview() {
  const { filename } = useParams();
  const [targetColor, setTargetColor] = useState("#ffa200");
  const [threshold, setThreshold] = useState(164);

  return (
    <Stack spacing={3}>
      <Button component={Link} to="/videos" sx={{ alignSelf: "flex-start" }}>
        Back to videos
      </Button>

      <Typography variant="h4" component="h1">
        Video Preview
      </Typography>

      <Typography>{filename}</Typography>

      <ImageComparison
        key={filename}
        filename={filename}
        targetColor={targetColor}
        threshold={threshold}
      />

<ProcessingJob
        key={`job-${filename}`}
        filename={filename}
        targetColor={targetColor}
        threshold={threshold}
      />

      <Stack spacing={3} sx={{ maxWidth: 640 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography component="label" htmlFor="target-color">
            Target color
          </Typography>

          <input
            id="target-color"
            type="color"
            value={targetColor}
            onChange={(event) => setTargetColor(event.target.value)}
          />

          <Typography>{targetColor.toUpperCase()}</Typography>
        </Stack>

        <Box>
          <Typography id="threshold-label">Threshold: {threshold}</Typography>

          <Slider
            aria-labelledby="threshold-label"
            min={0}
            max={442}
            step={1}
            value={threshold}
            onChange={(_, value) => setThreshold(value)}
            valueLabelDisplay="auto"
          />
        </Box>
      </Stack>
    </Stack>
  );
}
