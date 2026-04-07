import { useEffect, useState } from "react";
import { SignupCreate } from "@api";
import { Dialog } from "@components/dialog";
import { setFormValues, useAppForm } from "@components/form/context";
import { Link, useRouterState } from "@tanstack/react-router";
import { redirectOauth } from "@utils/oauth";
import { useCreateSignup, useGetOwnSignup } from "@api";
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
  const [rulesChecked, setRulesChecked] = useState(false);

  const { signup } = useGetOwnSignup(eventId);
  const { createSignup, isError: signupError } = useCreateSignup(
    qc,
    () => setIsOpen(false),
    (error) => alert(error),
  );

  const form = useAppForm({
    defaultValues: {
      expected_playtime: 1,
      needs_help: false,
      wants_to_help: false,
      partner_account_name: "",
    } as SignupCreate,
    onSubmit: (data) => {
      if (!discordId) {
        alert("You need to link your Discord account to apply.");
        return;
      }
      createSignup(eventId, data.value);
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset();
    setRulesChecked(!!signup);
    if (signup) {
      setFormValues(form, {
        expected_playtime: signup.expected_playtime ?? 1,
        needs_help: signup.needs_help ?? false,
        wants_to_help: signup.wants_to_help ?? false,
        partner_account_name: signup.partnerWish ?? "",
      });
    }
  }, [isOpen, signup]);

  return (
    <Dialog title="Apply for Event" open={isOpen} setOpen={setIsOpen}>
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <fieldset className="fieldset gap-4 rounded-box bg-base-300 p-4">
          <form.AppField
            name="expected_playtime"
            children={(field: any) => (
              <field.NumberField
                label="How many hours do you plan to play per day"
                min={1}
                max={24}
              />
            )}
          />
          <form.AppField
            name="needs_help"
            listeners={{
              onChange: ({ value }: { value: boolean }) => {
                if (value) form.setFieldValue("wants_to_help", false);
              },
            }}
            children={(field: any) => (
              <field.BooleanField label="I'm new and would like to have help" />
            )}
          />
          <form.AppField
            name="wants_to_help"
            listeners={{
              onChange: ({ value }: { value: boolean }) => {
                if (value) form.setFieldValue("needs_help", false);
              },
            }}
            children={(field: any) => (
              <field.BooleanField label="I'm experienced and would like to help others" />
            )}
          />
          <form.AppField
            name="partner_account_name"
            children={(field: any) => (
              <field.TextField label="Partner Wish (account name)" />
            )}
          />
          <label className="fieldset-label">
            <input
              type="checkbox"
              className="checkbox"
              checked={rulesChecked}
              onChange={(e) => setRulesChecked(e.target.checked)}
              required
            />
            I've read the
            <Link to="/rules" target="_blank" className="link link-info">
              rules
            </Link>
          </label>
        </fieldset>
        {!discordId && (
          <div className="mt-4">
            <p>
              You need a linked discord account and join our server to apply.
            </p>
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
          <button
            type="button"
            className="btn btn-error"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Apply
          </button>
        </div>
      </form>
    </Dialog>
  );
}
