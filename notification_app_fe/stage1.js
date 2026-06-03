const response = await fetch(
  "http://4.224.186.213/evaluation-service/notifications",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);

const data = await response.json();

const priority = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

data.notifications.sort((a, b) => {
  const p = priority[b.Type] - priority[a.Type];

  if (p !== 0) return p;

  return new Date(b.Timestamp) - new Date(a.Timestamp);
});

const top10 = data.notifications.slice(0, 10);

console.log(top10);

await Log("frontend", "info", "api", "Notifications fetched", token);

await Log("frontend", "debug", "component", "Priority sorting complete", token);