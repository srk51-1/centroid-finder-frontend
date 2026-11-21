import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

export default function VideoChooser() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadVideos() {
      try {
        const response = await fetch("/api/videos", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load videos.");
        }

        const data = await response.json();
        setVideos(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadVideos();

    return () => controller.abort();
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Choose a Video
      </Typography>

      <Typography color="text.secondary">
        Pick a video to adjust the detection settings.
      </Typography>

      {loading && <CircularProgress aria-label="Loading videos" />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && videos.length === 0 && (
        <Alert severity="info">No videos are available.</Alert>
      )}

      {videos.map((filename) => (
        <Button
          key={filename}
          component={Link}
          to={`/preview/${encodeURIComponent(filename)}`}
          variant="outlined"
          sx={{ justifyContent: "flex-start", textTransform: "none" }}
        >
          {filename}
        </Button>
      ))}
    </Stack>
  );
}