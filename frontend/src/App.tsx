import { useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { LoginPage } from "./features/auth/LoginPage";
import { AppLayout } from "./layouts/AppLayout";
import { getTheme } from "./theme/theme";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { ConfiguracionProvider } from "./contexts/ConfiguracionContext";

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AppLayout onLogout={logout} onToggleTheme={() => {}} />;
}

function App() {
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") ?? "light"
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AuthProvider>
        <ConfiguracionProvider>
          <SnackbarProvider>
            <AppContentWrapper setMode={setMode} />
          </SnackbarProvider>
        </ConfiguracionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContentWrapper({
  setMode,
}: {
  setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}) {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppLayout
      onLogout={logout}
      onToggleTheme={() =>
        setMode((current) => (current === "light" ? "dark" : "light"))
      }
    />
  );
}

export default App;