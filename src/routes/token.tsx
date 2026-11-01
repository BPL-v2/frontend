import { useGetUser } from "@api";
import {
  ArrowRightEndOnRectangleIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { redirectOauth } from "@utils/oauth";
import { usePageSEO } from "@utils/use-seo";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/token")({
  component: TokenPage,
});

const COPIED_FEEDBACK_MS = 2000;

function TokenPage() {
  usePageSEO("token");
  const state = useRouterState();
  const { user } = useGetUser();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const token = localStorage.getItem("auth");
  const loggedIn = token && user;

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <div className="card mx-auto mt-4 max-w-2xl bg-base-200">
      <div className="card-body text-left">
        <h1 className="card-title text-2xl">Your BPL Token</h1>
        {loggedIn ? (
          <>
            <p>Copy this token and paste it into BPL Tools.</p>
            <p className="text-warning">
              Anyone with this token can act as you on BPL. Never share it or
              show it on stream.
            </p>
            <div className="join mt-2 w-full">
              <input
                type={visible ? "text" : "password"}
                className="input join-item w-full font-mono"
                aria-label="BPL Token"
                value={token}
                readOnly
              />
              <button
                className="btn join-item"
                aria-label={visible ? "Hide token" : "Show token"}
                onClick={() => setVisible(!visible)}
              >
                {visible ? (
                  <EyeSlashIcon className="size-5" />
                ) : (
                  <EyeIcon className="size-5" />
                )}
              </button>
              <button
                className="btn join-item btn-primary"
                onClick={() =>
                  navigator.clipboard
                    .writeText(token)
                    .then(() => setCopied(true))
                }
              >
                {copied ? (
                  <CheckIcon className="size-5" />
                ) : (
                  <ClipboardDocumentIcon className="size-5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p>Log in to get your token.</p>
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={redirectOauth("poe", state.location.href)}
              >
                <ArrowRightEndOnRectangleIcon className="size-5" />
                Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
