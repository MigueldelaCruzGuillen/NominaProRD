import {
  Box,
  Paper,
  Skeleton,
} from "@mui/material";

export function DashboardChartsSkeleton() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "2fr 1fr",
        },
        gap: 2,
        mt: 3,
      }}
    >
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Skeleton width={220} height={35} />

        <Skeleton
          variant="rounded"
          height={320}
          sx={{ mt: 2 }}
        />
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Skeleton width={180} height={35} />

        <Skeleton
          variant="circular"
          width={220}
          height={220}
          sx={{
            mx: "auto",
            mt: 3,
          }}
        />
      </Paper>
    </Box>
  );
}