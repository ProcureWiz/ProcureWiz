export async function analyzeText(text) {
  const response = await fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      `Analyze request failed: ${response.status} ${response.statusText} ${
        errorBody?.error || ""}
    `
    );
  }

  return response.json();
}
