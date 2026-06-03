const SAMPLE_NOTIFICATIONS = [
  {
    ID: "sample-1",
    Type: "Placement",
    Message: "New placement alert",
    Timestamp: "2026-06-03T09:00:00Z",
  },
  {
    ID: "sample-2",
    Type: "Result",
    Message: "Result update available",
    Timestamp: "2026-06-03T08:30:00Z",
  },
  {
    ID: "sample-3",
    Type: "Event",
    Message: "Upcoming event reminder",
    Timestamp: "2026-06-03T07:45:00Z",
  },
];

export async function getNotifications(page = 1, limit = 10, type = "") {
  const filtered =
    type === ""
      ? SAMPLE_NOTIFICATIONS
      : SAMPLE_NOTIFICATIONS.filter((item) => item.Type === type);

  return {
    notifications: filtered.slice((page - 1) * limit, page * limit),
    totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
  };
}
