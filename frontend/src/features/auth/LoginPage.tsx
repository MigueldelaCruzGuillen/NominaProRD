import { useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { login } from "../../services/authService";

type Props = {
  onLogin: () => void;
};

export function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("miguel@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login({ email, password });
      localStorage.setItem("token", data.token);
      onLogin();
    } catch {
      alert("Credenciales inválidas o API apagada.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "background.default" }}>
      <Card sx={{ width: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            NominaPro RD
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Inicia sesión para continuar.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Correo" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} />

            <Button fullWidth type="submit" variant="contained" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}