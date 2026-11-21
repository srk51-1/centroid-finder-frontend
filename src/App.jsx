import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import {
  Button,
  Container,
  CssBaseline,
  Stack,
  Typography,
} from "@mui/material";
import VideoChooser from "./pages/VideoChooser";

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/videos" replace />} />

          <Route path="/videos" element={<VideoChooser />} />

          <Route
            path="/preview/:filename"
            element={
              <Stack spacing={3}>
                <Typography variant="h4" component="h1">
                  Video Preview
                </Typography>

                <Typography>
                  We will add the thumbnail and settings here next.
                </Typography>

                <Button component={Link} to="/videos">
                  Back to videos
                </Button>
              </Stack>
            }
          />

          <Route path="*" element={<Navigate to="/videos" replace />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}