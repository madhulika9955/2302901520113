import fs from "fs";
import { Log } from "../logging_middleware/logger.js";

const TOKEN =
  process.env.ACCESS_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzbWFkaHVsaWthOTQ2QGdtYWlsLmNvbSIsImV4cCI6MTc4MDQ2NDkzNywiaWF0IjoxNzgwNDY0MDM3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMWZjYWY0OTItMmZlMC00MTI3LWIzY2YtOThmMDMxNDRlOGE4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFkaHVsaWthIHNpbmdoIiwic3ViIjoiODk2ZTk1MDEtNWYyYi00NDZkLWFkNmUtNmQxNjU4MmNhMjVmIn0sImVtYWlsIjoic21hZGh1bGlrYTk0NkBnbWFpbC5jb20iLCJuYW1lIjoibWFkaHVsaWthIHNpbmdoIiwicm9sbE5vIjoiMjMwMjkwMTUyMDExMyIsImFjY2Vzc0NvZGUiOiJzZFdXZ2MiLCJjbGllbnRJRCI6Ijg5NmU5NTAxLTVmMmItNDQ2ZC1hZDZlLTZkMTY1ODJjYTI1ZiIsImNsaWVudFNlY3JldCI6IkZBQVdDa0d3RHdRdUp6dUQifQ.Y_xNjPfEdigItVHo9DPV0zMd30q7a2gpK165cI2uunc";

const SAMPLE_NOTIFICATIONS = [
  {
    Id: "sample-1",
    Type: "Placement",
    Message: "New placement alert",
    Timestamp: "2026-06-03T09:00:00Z",
  },
  {
    Id: "sample-2",
    Type: "Result",
    Message: "Result update available",
    Timestamp: "2026-06-03T08:30:00Z",
  },
  {
    Id: "sample-3",
    Type: "Event",
    Message: "Upcoming event reminder",
    Timestamp: "2026-06-03T07:45:00Z",
  },
];

async function fetchNotifications() {
  await Log("frontend", "info", "api", "Starting notification fetch", TOKEN);

  try {
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || `Request failed with status ${response.status}`,
      );
    }

    const notifications = Array.isArray(data?.notifications)
      ? data.notifications
      : [];

    await Log(
      "frontend",
      "info",
      "api",
      `Notifications fetched successfully (${notifications.length})`,
      TOKEN,
    );

    return notifications;
  } catch (error) {
    await Log(
      "frontend",
      "warn",
      "api",
      `Using sample notifications because the API request failed: ${error.message}`,
      TOKEN,
    );

    return SAMPLE_NOTIFICATIONS;
  }
}

async function sortNotificationsByPriority(notifications) {
  await Log(
    "frontend",
    "debug",
    "component",
    "Priority sorting started",
    TOKEN,
  );

  const weights = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  const sorted = notifications.sort((a, b) => {
    const weightDiff = weights[b.Type] - weights[a.Type];

    if (weightDiff !== 0) return weightDiff;

    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  await Log(
    "frontend",
    "debug",
    "component",
    "Priority sorting complete",
    TOKEN,
  );

  return sorted;
}

async function getTop10Notifications(sortedNotifications) {
  const top10 = sortedNotifications.slice(0, 10);

  await Log(
    "frontend",
    "info",
    "component",
    `Top 10 notifications extracted: ${top10.length}`,
    TOKEN,
  );

  return top10;
}

async function main() {
  try {
    const notifications = await fetchNotifications();
    console.log("All notifications:", notifications);

    const sorted = await sortNotificationsByPriority(notifications);
    console.log("Sorted notifications:", sorted);

    const top10 = await getTop10Notifications(sorted);
    console.log("TOP 10 NOTIFICATIONS:", top10);

    fs.writeFileSync("top10.json", JSON.stringify(top10, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
