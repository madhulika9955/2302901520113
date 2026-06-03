const BASE_URL = "http://4.224.186.213/evaluation-service/logs";

export async function Log(stack, level, packageName, message, token) {
  if (!token) return null;

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });

    return response.ok ? response : null;
  } catch (error) {
    return null;
  }
}
