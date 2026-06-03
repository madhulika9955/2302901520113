import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";
import AllNotifications from "./pages/AllNotifications";
import PriorityNotifications from "./pages/PriorityNotifications";

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button component={Link} to="/" variant="contained">
            All Notifications
          </Button>
          <Button component={Link} to="/priority" variant="contained">
            Priority Notifications
          </Button>
        </Stack>

        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityNotifications />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
