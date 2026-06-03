import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { getNotifications } from "../api/notificationApi";
import { Log } from "../middleware/logger";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzbWFkaHVsaWthOTQ2QGdtYWlsLmNvbSIsImV4cCI6MTc4MDQ2NDkzNywiaWF0IjoxNzgwNDY0MDM3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMWZjYWY0OTItMmZlMC00MTI3LWIzY2YtOThmMDMxNDRlOGE4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFkaHVsaWthIHNpbmdoIiwic3ViIjoiODk2ZTk1MDEtNWYyYi00NDZkLWFkNmUtNmQxNjU4MmNhMjVmIn0sImVtYWlsIjoic21hZGh1bGlrYTk0NkBnbWFpbC5jb20iLCJuYW1lIjoibWFkaHVsaWthIHNpbmdoIiwicm9sbE5vIjoiMjMwMjkwMTUyMDExMyIsImFjY2Vzc0NvZGUiOiJzZFdXZ2MiLCJjbGllbnRJRCI6Ijg5NmU5NTAxLTVmMmItNDQ2ZC1hZDZlLTZkMTY1ODJjYTI1ZiIsImNsaWVudFNlY3JldCI6IkZBQVdDa0d3RHdRdUp6dUQifQ.Y_xNjPfEdigItVHo9DPV0zMd30q7a2gpK165cI2uunc";

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export default function PriorityNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    loadData();
  }, [limit]);

  async function loadData() {
    try {
      await Log("frontend", "info", "page", "Priority page loaded", TOKEN);
      const data = await getNotifications(1, 1000, "");
      const sorted = (data.notifications || []).sort((a, b) => {
        const weightDiff = weights[b.Type] - weights[a.Type];
        if (weightDiff !== 0) return weightDiff;
        return new Date(b.Timestamp) - new Date(a.Timestamp);
      });

      setNotifications(sorted.slice(0, limit));
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
    <Box sx={{ p: 2 }}>
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
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

      {notifications.map((item) => (
        <Card key={item.ID} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{item.Message}</Typography>
            <Typography variant="body2">Type: {item.Type}</Typography>
            <Typography variant="body2">Time: {item.Timestamp}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
