import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import VideoChooser from "./pages/VideoChooser";
import VideoPreview from "./pages/VideoPreview";

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
            element={<VideoPreview />}
          />

          <Route path="*" element={<Navigate to="/videos" replace />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}