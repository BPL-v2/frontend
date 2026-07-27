import { oauthCallbackBase, oauthRedirectBase } from "@api";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { router } from "../main";
import { getGetUserBaseQueryKey } from "@api/generated/user/user";
import { getOauthStateOrigin } from "@utils/oauth";

type CallbackProps = {
  state: string;
  code: string;
  error?: string;
  error_description?: string;
  provider: "poe" | "discord" | "twitch";
};
export type OauthQueryParams = {
  state: string;
  code: string;
  error?: string;
  error_description?: string;
};

export function Callback({
  state,
  code,
  error,
  error_description,
  provider,
}: CallbackProps) {
  const qc = useQueryClient();

  useEffect(() => {
    if (error) {
      return;
    }
    if (!state || !code || !provider) {
      router.navigate({
        to: "/",
        replace: true,
      });
      return;
    }
    // The oauth provider can only redirect back to bpl-poe.com (that's the
    // only redirect_uri we're allowed to register), so when testing against
    // e.g. localhost, the flow started on a different origin than this page
    // is running on. That origin's backend is the one holding the matching
    // state/verifier, so we forward the browser there (same path, same
    // query string) instead of trying to exchange the code here.
    const stateOrigin = getOauthStateOrigin(state);
    if (stateOrigin && stateOrigin !== window.location.origin) {
      window.location.href =
        stateOrigin + window.location.pathname + window.location.search;
      return;
    }
    oauthCallbackBase(provider, {
      state: state,
      code: code,
      referrer: localStorage.getItem("referrer") || undefined,
    })
      .then((resp) => {
        localStorage.setItem("auth", resp.auth_token);
        localStorage.removeItem("referrer");
        qc.resetQueries({ queryKey: getGetUserBaseQueryKey() });

        if (provider === "poe" && !resp.user.discord_id) {
          oauthRedirectBase("discord", { last_url: resp.last_path }).then(
            (urlString) => {
              window.open(urlString, "_self");
            },
          );
          return;
        }

        // last_path is now always an absolute, same-origin URL (see
        // utils/oauth.ts) - strip it back down to a path for the router.
        const lastPath = resp.last_path.startsWith("http")
          ? resp.last_path.slice(window.location.origin.length)
          : resp.last_path;

        router.navigate({
          to: lastPath,
          replace: true,
        });
      })
      .catch((err) => {
        // Keep error logging in production for debugging purposes
        console.error(`[OAuth] ${provider} authentication failed:`, err);
      });
  }, [state, code, provider, error, qc]);
  if (error) {
    return (
      <>
        <h1 className="text-center text-3xl font-bold text-error">
          Error: {error} - {error_description}
        </h1>
        <Link to="/" className="btn mt-4 btn-primary">
          Return to home page
        </Link>
      </>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="loading loading-lg loading-spinner"></div>
      <h1 className="text-2xl font-semibold">
        {provider === "poe"
          ? "Authenticating with Path of Exile..."
          : provider === "discord"
            ? "Authenticating with Discord..."
            : "Handling Authentication..."}
      </h1>
      {provider === "poe" && (
        <p className="text-center text-base-content/70">
          After connecting your Path of Exile account, you'll be prompted to
          connect Discord.
        </p>
      )}
    </div>
  );
}
