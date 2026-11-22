import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

export default function ProcessingJob({
  filename,
  targetColor,
  threshold,
}) {
  const [job, setJob] = useState(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const jobId = job?.jobId;

  useEffect(() => {
    if (!jobId) return;

    const controller = new AbortController();
    let timer;

    async function checkStatus() {
      try {
        const response = await fetch(
          `/process/${encodeURIComponent(jobId)}/status`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Could not check the job status.");
        }

        const data = await response.json();

        if (controller.signal.aborted) return;

        if (data.status === "error") {
          throw new Error(data.error || "Video processing failed.");
        }

        if (
          data.status !== "processing" &&
          data.status !== "done"
        ) {
          throw new Error("The server returned an unknown job status.");
        }

        setJob({ jobId, ...data });

        if (data.status === "processing") {
          timer = setTimeout(checkStatus, 1000);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message);
          setJob({ jobId, status: "error" });
        }
      }
    }

    checkStatus();

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [jobId]);

  async function startProcessing() {
    setStarting(true);
    setError("");
    setJob(null);

    try {
      const settings = new URLSearchParams({
        targetColor: targetColor.slice(1),
        threshold: String(threshold),
      });

      const response = await fetch(
        `/process/${encodeURIComponent(filename)}?${settings}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Could not start video processing.");
      }

      const data = await response.json();

      if (typeof data.jobId !== "string" || !data.jobId) {
        throw new Error("The server did not return a job ID.");
      }

      setJob({
        jobId: data.jobId,
        status: "processing",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setStarting(false);
    }
  }

  const busy = starting || job?.status === "processing";

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        onClick={startProcessing}
        disabled={busy}
        sx={{ alignSelf: "flex-start" }}
      >
        Process Video with These Settings
      </Button>

      {busy && (
        <Stack spacing={1} role="status">
          <Typography>
            {starting ? "Starting the job..." : "Processing video..."}
          </Typography>

          <LinearProgress />
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {job?.status === "done" && (
        <Alert severity="success">
          Processing finished.{" "}
          <a href={job.result} download>
            Download CSV
          </a>
        </Alert>
      )}
    </Stack>
  );
}