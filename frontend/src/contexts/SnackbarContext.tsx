import { createContext, useContext, useState } from "react";
import { AppSnackbar } from "../components/common/AppSnackbar";
import { type ReactNode } from "react";

type Severity = "success" | "error" | "warning" | "info";

type SnackbarContextType = {
  showMessage: (message: string, severity?: Severity) => void;
};

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>("success");

  function showMessage(msg: string, sev: Severity = "success") {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}

      <AppSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={() => setOpen(false)}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar debe usarse dentro de SnackbarProvider");
  }

  return context;
}