import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LoginPage } from "./features/auth/LoginPage";
import { AppLayout } from "./layouts/AppLayout";
import { getTheme } from "./theme/theme";
import { useEffect, useMemo, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") ?? "light"
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {!isAuthenticated ? (
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <AppLayout
          onLogout={handleLogout}
          onToggleTheme={() => {
            console.log("Cambiando tema");
            setMode((current) => (current === "light" ? "dark" : "light"));
          }}
        />
      )}
    </ThemeProvider>
  );
}

export default App;