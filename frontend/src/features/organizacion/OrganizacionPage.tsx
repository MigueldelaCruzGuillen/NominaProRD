import { useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import { DepartamentosTab } from "./components/DepartamentosTab";
import { PuestosTab } from "./components/PuestosTab";

export function OrganizacionPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Organización
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Gestiona la estructura organizacional de la empresa.
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ mb: 3 }}
      >
        <Tab label="Departamentos" />
        <Tab label="Puestos" />
      </Tabs>

      {tab === 0 && <DepartamentosTab />}
      {tab === 1 && <PuestosTab />}
    </Box>
  );
}