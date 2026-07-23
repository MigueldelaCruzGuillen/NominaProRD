import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

type Props = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function SearchBox({
  value,
  placeholder = "Buscar...",
  onChange,
}: Props) {
  return (
    <TextField
      fullWidth
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      sx={{ bgcolor: "background.paper" }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
}