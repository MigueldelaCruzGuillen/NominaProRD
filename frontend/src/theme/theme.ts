import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#2563eb",
      },
      secondary: {
        main: "#0f172a",
      },
      background: {
        default: mode === "light" ? "#f5f7fb" : "#020617",
        paper: mode === "light" ? "#ffffff" : "#0f172a",
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: "Inter, Roboto, sans-serif",
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color .25s ease, color .25s ease",
          },
        },
      },
    },
  });