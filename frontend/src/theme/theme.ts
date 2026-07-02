import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563eb",
    },

    secondary: {
      main: "#0f172a",
    },

    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "Inter, Roboto, sans-serif",

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});