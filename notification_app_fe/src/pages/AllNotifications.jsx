import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { getNotifications } from "../api/notificationApi";
import { Log } from "../middleware/logger";

const TOKEN = "";

export default function AllNotifications() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const viewed = useMemo(() => {
    return JSON.parse(localStorage.getItem("viewed") || "[]");
  }, []);

  useEffect(() => {
    loadData();
  }, [page, type]);

  async function loadData() {
    try {
      await Log("frontend", "info", "page", "All Notifications loaded", TOKEN);
      const data = await getNotifications(page, 10, type);
      setItems(data.notifications || []);
      setTotalPages(data.totalPages || 1);
      await Log(
        "frontend",
        "info",
        "api",
        "Notifications fetched successfully",
        TOKEN,
      );
    } catch (error) {
      await Log(
        "frontend",
        "error",
        "api",
        "All notifications fetch failed",
        TOKEN,
      );
    }
  }

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={type}
            label="Filter"
            onChange={(e) => {
              setPage(1);
              setType(e.target.value);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {items.map((item) => {
        const isViewed = viewed.includes(item.ID);

        return (
          <Card key={item.ID} sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
                <Chip
                  size="small"
                  color={isViewed ? "default" : "success"}
                  label={isViewed ? "VIEWED" : "NEW"}
                />
                <Chip size="small" label={item.Type} />
              </Stack>

              <Typography variant="h6">{item.Message}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.Timestamp}
              </Typography>
            </CardContent>
          </Card>
        );
      })}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
