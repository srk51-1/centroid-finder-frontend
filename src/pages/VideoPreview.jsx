import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

export default function VideoPreview() {
  const { filename } = useParams();
  const [error, setError] = useState(false);

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
    </Stack>
  );
}