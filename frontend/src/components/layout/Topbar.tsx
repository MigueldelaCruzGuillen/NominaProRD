import { Avatar, Box, Button, Typography } from "@mui/material";

type Props = {
  onLogout: () => void;
};

export function Topbar({ onLogout }: Props) {
  return (
    <Box sx={{ height: 72, bgcolor: "#fff", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", px: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Panel administrativo
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="body2">Miguel</Typography>
        <Avatar sx={{ width: 36, height: 36 }}>M</Avatar>
        <Button variant="outlined" size="small" onClick={onLogout}>
          Salir
        </Button>
      </Box>
    </Box>
  );
}