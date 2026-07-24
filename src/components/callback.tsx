import { oauthCallbackBase, oauthRedirectBase } from "@api";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { router } from "../main";
import { getGetUserBaseQueryKey } from "@api/generated/user/user";

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
    oauthCallbackBase(provider, {
      state: state,
      code: code,
      referrer: localStorage.getItem("referrer") || undefined,
    })
      .then((resp) => {
        // last_path is an approved-origin absolute URL (see utils/oauth.ts).
        // If it points somewhere other than where this callback page is
        // running (e.g. we're on bpl-poe.com because that's the only
        // registered oauth redirect_uri, but the user actually started on
        // localhost), hand off the auth token to that origin instead of
        // logging in here.
        const target = new URL(resp.last_path);
        if (target.origin !== window.location.origin) {
          target.hash = `auth=${resp.auth_token}`;
          window.location.href = target.toString();
          return;
        }

        localStorage.setItem("auth", resp.auth_token);
        localStorage.removeItem("referrer");
        qc.resetQueries({ queryKey: getGetUserBaseQueryKey() });

        const lastPath = target.pathname + target.search + target.hash;

        if (provider === "poe" && !resp.user.discord_id) {
          oauthRedirectBase("discord", { last_url: resp.last_path }).then(
            (urlString) => {
              window.open(urlString, "_self");
            },
          );
          return;
        }

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
