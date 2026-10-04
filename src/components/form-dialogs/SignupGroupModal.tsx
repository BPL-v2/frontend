import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateSignupGroup,
  useGetOwnSignup,
  useJoinSignupGroup,
  useLeaveSignupGroup,
} from "@api";
import { Dialog } from "@components/dialog";
import {
  CheckIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

interface SignupGroupModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
}

export function SignupGroupModal({
  isOpen,
  setIsOpen,
  eventId,
}: SignupGroupModalProps) {
  const qc = useQueryClient();
  const { signup } = useGetOwnSignup(eventId);
  const [groupKey, setGroupKey] = useState("");
  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const onError = (error: string) => alert(error);
  const { createGroup, createGroupPending } = useCreateSignupGroup(
    qc,
    undefined,
    onError,
  );
  const { joinGroup, joinGroupPending } = useJoinSignupGroup(
    qc,
    () => setGroupKey(""),
    onError,
  );
  const { leaveGroup, leaveGroupPending } = useLeaveSignupGroup(
    qc,
    undefined,
    onError,
  );
  const group = signup?.group;
  const close = (open: boolean) => {
    if (!open) {
      // never keep the key on screen after closing, streamers might reopen it live
      setKeyVisible(false);
      setCopied(false);
    }
    setIsOpen(open);
  };
  const pending = createGroupPending || joinGroupPending || leaveGroupPending;

  return (
    <Dialog title="Group Signup" open={isOpen} setOpen={close}>
      <div className="flex w-full flex-col gap-4 rounded-box bg-base-300 p-4">
        {group ? (
          <>
            <div>
              <div className="mb-1 font-bold">Group key</div>
              <div className="flex gap-2">
                <input
                  className="input w-full font-mono"
                  type={keyVisible ? "text" : "password"}
                  value={group.key}
                  readOnly
                  autoComplete="off"
                  data-1p-ignore
                />
                <button
                  type="button"
                  className="btn btn-square"
                  title={keyVisible ? "Hide key" : "Show key"}
                  onClick={() => setKeyVisible(!keyVisible)}
                >
                  {keyVisible ? (
                    <EyeSlashIcon className="size-5" />
                  ) : (
                    <EyeIcon className="size-5" />
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-square btn-primary"
                  title="Copy key"
                  onClick={() => {
                    navigator.clipboard.writeText(group.key);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? (
                    <CheckIcon className="size-5" />
                  ) : (
                    <ClipboardDocumentIcon className="size-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-sm">
                Share this key with the players you want to play with. They can
                join with the "Join group" option.
              </p>
            </div>
            <div className="rounded-box bg-base-200 p-4 text-left">
              <div className="mb-1 font-bold">
                Members ({group.members.length}/{group.max_size})
              </div>
              <ul className="list-inside list-disc">
                {group.members.map((member) => (
                  <li key={member.id}>
                    {member.account_name ?? member.display_name}
                    {member.id === signup?.user.id && " (you)"}
                  </li>
                ))}
              </ul>
            </div>
            {group.locked ? (
              <p className="text-warning">
                This group is locked because players were already sorted into
                teams.
              </p>
            ) : (
              <button
                className="btn btn-error"
                disabled={pending}
                onClick={() => leaveGroup(eventId)}
              >
                Leave group
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className="btn btn-primary"
              disabled={pending}
              onClick={() => createGroup(eventId)}
            >
              Create group
            </button>
            <div className="divider my-0">or</div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                joinGroup(eventId, groupKey);
              }}
            >
              <input
                className="input w-full font-mono"
                type="password"
                autoComplete="off"
                data-1p-ignore
                placeholder="Group key"
                value={groupKey}
                onChange={(e) => setGroupKey(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={pending}
              >
                Join group
              </button>
            </form>
          </>
        )}
      </div>
      <div className="modal-action w-full">
        <button className="btn" onClick={() => close(false)}>
          Close
        </button>
      </div>
    </Dialog>
  );
}
