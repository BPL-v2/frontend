import React, { useEffect, useRef } from "react";
import { Dialog } from "@components/dialog";
import { Link, useRouterState } from "@tanstack/react-router";
import { redirectOauth } from "@utils/oauth";
import { useCreateSignup, useGetOwnSignup } from "@client/query";
import { useQueryClient } from "@tanstack/react-query";
import { DiscordFilled } from "@icons/discord";

interface SignupFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  discordId: string | null | undefined;
}

export function SignupFormModal({
  isOpen,
  setIsOpen,
  eventId,
  discordId,
}: SignupFormModalProps) {
  const qc = useQueryClient();
  const state = useRouterState();
  const formRef = useRef<HTMLFormElement>(null);
  const [hourValue, setHourValue] = React.useState(1);
  const [needHelp, setNeedHelp] = React.useState(false);
  const [wantToHelp, setWantToHelp] = React.useState(false);
  const [partnerWish, setPartnerWish] = React.useState("");

  const { signup } = useGetOwnSignup(eventId);
  const { createSignup, isError: signupError } = useCreateSignup(
    qc,
    () => setIsOpen(false),
    (error) => alert(error),
  );

  useEffect(() => {
    if (!isOpen) return;
    setHourValue(signup?.expected_playtime ?? 1);
    setNeedHelp(signup?.needs_help ?? false);
    setWantToHelp(signup?.wants_to_help ?? false);
  }, [isOpen, signup]);

  return (
    <Dialog title="Apply for Event" open={isOpen} setOpen={setIsOpen}>
      <form
        className="w-full"
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          if (!discordId) {
            alert("You need to link your Discord account to apply.");
            return;
          }
          createSignup({
            eventId,
            body: {
              expected_playtime: hourValue,
              wants_to_help: wantToHelp,
              needs_help: needHelp,
              partner_account_name: partnerWish,
              extra:
                formData.get("extra") === "on"
                  ? JSON.stringify({ guild_owner: true })
                  : undefined,
            },
          });
        }}
      >
        <fieldset className="fieldset gap-4 rounded-box bg-base-300 p-4">
          <label className="fieldset-label">
            How many hours will you be able to play per day?
          </label>
          <div className="flex items-center gap-2">
            <span className="w-6 text-lg text-base-content">{hourValue}</span>
            <div className="w-full">
              <input
                type="range"
                min={1}
                max="24"
                value={hourValue}
                className="range w-full range-primary"
                step="1"
                onChange={(e) => setHourValue(parseInt(e.target.value))}
              />
            </div>
          </div>
          <label className="fieldset-label">
            <input
              type="checkbox"
              id="need_help"
              name="need_help"
              className="checkbox"
              onChange={(e) => {
                setNeedHelp(e.target.checked);
                setWantToHelp(false);
              }}
              checked={needHelp}
            />
            I'm new and would like to have help
          </label>
          <label className="fieldset-label">
            <input
              type="checkbox"
              id="want_to_help"
              name="want_to_help"
              className="checkbox"
              onChange={(e) => {
                setWantToHelp(e.target.checked);
                setNeedHelp(false);
              }}
              checked={wantToHelp}
            />
            I'm experienced and would like to help others
          </label>
          <label className="fieldset-label">
            <input
              type="checkbox"
              id="rulecheck"
              name="rulecheck"
              className="checkbox"
              defaultChecked={!!signup}
              required
            />
            I've read the
            <Link to="/rules" target="_blank" className="link link-info">
              rules
            </Link>
          </label>
        </fieldset>
      </form>
      {!discordId && (
        <div className="mt-4">
          <p>You need a linked discord account and join our server to apply.</p>
          <a
            className="bg-discord btn mt-4 text-xl text-white btn-lg"
            onClick={redirectOauth("discord", state.location.href)}
          >
            <DiscordFilled className="size-6" />
            Link Discord account
          </a>
        </div>
      )}
      {signupError ? null : (
        <div className="mt-4">
          <p>
            Join our{" "}
            <a
              href="https://discord.com/invite/3weG9JACgb"
              target="_blank"
              className="link link-info"
            >
              discord server
            </a>{" "}
            to apply for the event.
          </p>
        </div>
      )}
      <div className="modal-action w-full">
        <button className="btn btn-error" onClick={() => setIsOpen(false)}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => formRef.current?.requestSubmit()}
        >
          Apply
        </button>
      </div>
    </Dialog>
  );
}
