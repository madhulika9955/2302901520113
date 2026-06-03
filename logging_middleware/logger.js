const BASE_URL = "http://4.224.186.213/evaluation-service/logs";

export const Log = async (stack, level, packageName, message, token) => {
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
    return await response.json();
  } catch (error) {
    console.error("Logging failed:", error);
    throw error;
  }
};
