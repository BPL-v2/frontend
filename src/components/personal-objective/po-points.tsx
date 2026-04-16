import { useGetLadder, useGetUser, useUpdateCharacter } from "@api";
import React, { useContext } from "react";
import GeneralPoPoints from "./general-po-points";
import CustomPoPoints from "./custom-po-points";
import { GlobalStateContext } from "@utils/context-provider";
import { useQueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";

export default function PoPoints(): React.JSX.Element {
  const { currentEvent } = useContext(GlobalStateContext);
  const { ladder } = useGetLadder(currentEvent.id);
  const { user } = useGetUser();
  const { updateCharacter, updateCharacterPending } = useUpdateCharacter(
    useQueryClient(),
    currentEvent.id,
  );
  let char = ladder
    ?.sort((a, b) => b.level - a.level)
    .find((c) => c.user_id === user?.id);
  return (
    <div className="flex flex-col gap-2">
      <h2 className="mt-4">Personal Objectives</h2>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Help your team out by improving your character and earn up to 17
          points for your team.
        </h3>
        <button
          className={twMerge("btn", char ? "btn-primary" : "btn-disabled")}
          onClick={() => (char ? updateCharacter(char.character_id) : null)}
          disabled={!char || updateCharacterPending}
        >
          {updateCharacterPending && (
            <div className="loading loading-md loading-spinner"></div>
          )}
          Update character
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <GeneralPoPoints char={char} />
        <CustomPoPoints char={char} />
      </div>
    </div>
  );
}
