import type { ReactNode } from "react";
import { Card, CardContent, Typography } from "@mui/material";

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
};

export function ReporteCard({
  title,
  description,
  icon,
  children,
}: Props) {
  return (
    <Card
      sx={{
        width: 320,
        height: "100%",
      }}
    >
      <CardContent>
        {icon}

        <Typography variant="h6" sx={{ mt: icon ? 1 : 0, mb: 1 }}>
          {title}
        </Typography>

        {description && (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
}