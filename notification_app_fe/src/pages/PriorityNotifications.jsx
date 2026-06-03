import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { getNotifications } from "../api/notificationApi";
import { Log } from "../middleware/logger";

const TOKEN = "";

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export default function PriorityNotifications() {
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, [limit]);

  async function loadData() {
    try {
      await Log(
        "frontend",
        "info",
        "page",
        "Priority Notifications loaded",
        TOKEN,
      );
      const data = await getNotifications(1, 1000, "");
      const sorted = [...(data.notifications || [])].sort((a, b) => {
        const diff = weights[b.Type] - weights[a.Type];
        if (diff !== 0) return diff;
        return new Date(b.Timestamp) - new Date(a.Timestamp);
      });
      setItems(sorted.slice(0, limit));
      await Log(
        "frontend",
        "info",
        "api",
        "Priority notifications prepared",
        TOKEN,
      );
    } catch (error) {
      await Log("frontend", "error", "api", "Priority fetch failed", TOKEN);
    }
  }

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Top N</InputLabel>
          <Select
            value={limit}
            label="Top N"
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {items.map((item) => (
        <Card key={item.ID} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{item.Message}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.Type} • {item.Timestamp}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
