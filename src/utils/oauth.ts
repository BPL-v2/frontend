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

// The backend embeds the origin the oauth flow started from into the state
// param, as "<randomState>.<base64url(origin)>" (see embedOriginInState in
// oauth-service.go). Providers only guarantee to echo the state param back
// completely unchanged, so this lets us recognize - client-side, before
// calling any backend - that the callback landed on the wrong origin
// (bpl-poe.com is the only registered redirect_uri) and needs to be
// forwarded to the origin whose backend actually holds the matching state.
export function getOauthStateOrigin(state: string): string | null {
  const separatorIndex = state.lastIndexOf(".");
  if (separatorIndex === -1) {
    return null;
  }
  const encoded = state
    .slice(separatorIndex + 1)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
  try {
    return atob(padded);
  } catch {
    return null;
  }
}
