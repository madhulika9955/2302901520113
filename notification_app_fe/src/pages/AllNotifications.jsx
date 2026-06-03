import { useState, useEffect } from "react";
import { getNotifications } from "../api/notificationApi";
import { Log } from "../middleware/logger";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzbWFkaHVsaWthOTQ2QGdtYWlsLmNvbSIsImV4cCI6MTc4MDQ2NDkzNywiaWF0IjoxNzgwNDY0MDM3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMWZjYWY0OTItMmZlMC00MTI3LWIzY2YtOThmMDMxNDRlOGE4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFkaHVsaWthIHNpbmdoIiwic3ViIjoiODk2ZTk1MDEtNWYyYi00NDZkLWFkNmUtNmQxNjU4MmNhMjVmIn0sImVtYWlsIjoic21hZGh1bGlrYTk0NkBnbWFpbC5jb20iLCJuYW1lIjoibWFkaHVsaWthIHNpbmdoIiwicm9sbE5vIjoiMjMwMjkwMTUyMDExMyIsImFjY2Vzc0NvZGUiOiJzZFdXZ2MiLCJjbGllbnRJRCI6Ijg5NmU5NTAxLTVmMmItNDQ2ZC1hZDZlLTZkMTY1ODJjYTI1ZiIsImNsaWVudFNlY3JldCI6IkZBQVdDa0d3RHdRdUp6dUQifQ.Y_xNjPfEdigItVHo9DPV0zMd30q7a2gpK165cI2uunc";

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, [page, filterType]);

  const fetchNotifications = async () => {
    Log("frontend", "info", "page", "All Notifications page loaded", TOKEN);
    Log("frontend", "info", "api", "Fetching notifications", TOKEN);

    try {
      const data = await getNotifications(page, 10, filterType);
      setNotifications(data.notifications);
      Log(
        "frontend",
        "info",
        "api",
        "Notifications loaded successfully",
        TOKEN,
      );
    } catch (error) {
      Log("frontend", "error", "component", "Notification fetch failed", TOKEN);
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 2 }} size="small">
        <InputLabel>Type</InputLabel>
        <Select
          value={filterType}
          label="Type"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      {notifications.map((notif) => {
        const isViewed = JSON.parse(
          localStorage.getItem("viewed") || "[]",
        ).includes(notif.ID);

        return (
          <Card sx={{ m: 2 }}>
            <CardContent>
              {isViewed ? (
                <Typography variant="h6">[VIEWED] {notif.Message}</Typography>
              ) : (
                <Typography variant="h6">[NEW] {notif.Message}</Typography>
              )}
              <Typography color="text.secondary">{notif.Type}</Typography>
              <Typography color="text.secondary">{notif.Timestamp}</Typography>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
