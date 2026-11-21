import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Stack,
  Slider,
  Typography,
} from "@mui/material";

export default function VideoPreview() {
  const { filename } = useParams();
  const [error, setError] = useState(false);
  const [targetColor, setTargetColor] = useState("#ffa200");
  const [threshold, setThreshold] = useState(164);

  return (
    <Stack spacing={3}>
      <Button
        component={Link}
        to="/videos"
        sx={{ alignSelf: "flex-start" }}
      >
        Back to videos
      </Button>

      <Typography variant="h4" component="h1">
        Video Preview
      </Typography>

      <Typography>{filename}</Typography>

      {error ? (
        <Alert severity="error">
          Could not load the thumbnail. Check that the server is running.
        </Alert>
      ) : (
        <Box
          component="img"
          src={`/thumbnail/${encodeURIComponent(filename)}`}
          alt={`First frame of ${filename}`}
          onError={() => setError(true)}
          sx={{
            width: "100%",
            maxWidth: 640,
            height: "auto",
            borderRadius: 2,
          }}
        />
      )}

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
          <Typography id="threshold-label">
            Threshold: {threshold}
          </Typography>

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