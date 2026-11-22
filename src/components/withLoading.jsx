import { Alert, CircularProgress } from "@mui/material";

export default function withLoading(Component) {
  return function WithLoading({ loading, error, ...props }) {
    if (loading) {
      return <CircularProgress aria-label="Loading" />;
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    return <Component {...props} />;
  };
}