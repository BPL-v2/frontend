const baseUrl = process.env.VITE_PUBLIC_BPL_BACKEND_URL;

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === "string" && ISO_DATE_RE.test(value)) {
    return new Date(value);
  }
  return value;
}

export async function customFetch<TResponse>(
  url: string,
  options: RequestInit,
): Promise<TResponse> {
  const authToken = localStorage.getItem("auth");
  const headers = new Headers(options.headers || {});
  if (authToken) {
    try {
      headers.set("Authorization", `Bearer ${authToken}`);
    } catch (error) {
      console.error("Error setting auth token:", error);
    }
  }
  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    mode: "cors",
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `API request failed (${response.status}): ${text || response.statusText}`,
    );
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return JSON.parse(await response.text(), dateReviver) as TResponse;
  }

  if (contentType && !contentType.startsWith("text/")) {
    return (await response.blob()) as TResponse;
  }

  return (await response.text()) as TResponse;
}
