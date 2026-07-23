import { Grid, Paper, Skeleton } from "@mui/material";

export function DashboardStatsSkeleton() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Skeleton width="45%" />
            <Skeleton variant="text" width="70%" height={48} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}