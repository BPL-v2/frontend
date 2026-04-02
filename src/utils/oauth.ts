import { oauthRedirectBase } from "@api";

export function redirectOauth(
  provider: "discord" | "twitch" | "poe",
  latestUrl: string,
): () => Promise<void | Window | null> {
  return () =>
    oauthRedirectBase(provider, { last_url: latestUrl })
      .then((urlString) => window.open(urlString, "_self"));
}
