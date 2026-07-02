import { useState } from "react";
import { LoginPage } from "./features/auth/LoginPage";
import { AppLayout } from "./layouts/AppLayout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AppLayout onLogout={handleLogout} />;
}

export default App;