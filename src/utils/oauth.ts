import { oauthRedirectBase } from "@api";

// Providers only allow us to register a single redirect_uri
// (https://bpl-poe.com/...), so the oauth callback always lands there first.
// We send an absolute URL (including our current origin) as last_url so
// that once the callback completes on bpl-poe.com, it can hand the user back
// to the origin they actually started from (e.g. localhost while testing),
// as long as that origin is on the backend's approved list.
export function redirectOauth(
  provider: "discord" | "twitch" | "poe",
  latestUrl: string,
): () => Promise<void | Window | null> {
  const absoluteUrl = toAbsoluteUrl(latestUrl);
  return () =>
    oauthRedirectBase(provider, { last_url: absoluteUrl }).then((urlString) =>
      window.open(urlString, "_self"),
    );
}

export function toAbsoluteUrl(url: string): string {
  return url.startsWith("http") ? url : `${window.location.origin}${url}`;
}
