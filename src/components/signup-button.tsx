import React, { useContext, useMemo } from "react";
import { GlobalStateContext } from "@utils/context-provider";
import { ApplicationStatus } from "@api";
import { TeamName } from "@components/team/team-name";
import {
  useDeleteSignup,
  useGetEvents,
  useGetEventStatus,
  useGetOwnSignup,
  useGetUser,
} from "@api";
import { useQueryClient } from "@tanstack/react-query";
import { SignupFormModal } from "@components/form-dialogs/SignupFormModal";
import { SignupGroupModal } from "@components/form-dialogs/SignupGroupModal";

function SignupButton() {
  const { currentEvent } = useContext(GlobalStateContext);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [groupModalOpen, setGroupModalOpen] = React.useState(false);
  const qc = useQueryClient();
  const { user, isLoading: userLoading, isError: userError } = useGetUser();
  const { events } = useGetEvents();
  const upcomingEvent =
    events?.sort((a, b) => {
      return (
        (new Date(b.event_start_time).getTime() || 0) -
        (new Date(a.event_start_time).getTime() || 0)
      );
    })[0] || currentEvent;
  const { eventStatus, isError: eventStatusError } = useGetEventStatus(
    upcomingEvent.id,
  );
  const { deleteSignup } = useDeleteSignup(qc);
  const { signup } = useGetOwnSignup(upcomingEvent.id);
  const groupSize = signup?.group?.members.length ?? 0;

  const dialog = useMemo(() => {
    return (
      <SignupFormModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        eventId={upcomingEvent.id}
        discordId={user?.discord_id}
      />
    );
  }, [modalOpen, upcomingEvent.id, user?.discord_id]);

  const groupDialog = (
    <SignupGroupModal
      isOpen={groupModalOpen}
      setIsOpen={setGroupModalOpen}
      eventId={upcomingEvent.id}
    />
  );

  const userTeam = useMemo(() => {
    return (
      user &&
      upcomingEvent?.teams.find((team) => team.id === eventStatus?.team_id)
    );
  }, [eventStatus, user, upcomingEvent]);

  if (
    !user ||
    userLoading ||
    userError ||
    eventStatusError ||
    new Date() > upcomingEvent.application_end_time ||
    new Date() < upcomingEvent.application_start_time
  ) {
    return null;
  }

  if (userTeam) {
    return (
      <span className="text-2xl">
        Sorted with <TeamName team={userTeam} className="font-bold" />
      </span>
    );
  }
  if (eventStatus?.application_status === ApplicationStatus.waitlisted) {
    return (
      "Waitlist position: " +
      (eventStatus.number_of_signups_before - currentEvent.max_size + 1)
    );
  }
  if (eventStatus?.application_status === ApplicationStatus.applied) {
    return (
      <>
        {dialog}
        {upcomingEvent.max_group_size > 1 && groupDialog}
        <div className="dropdown">
          <button className={"cursor-pointer"}>
            <span className="text-2xl">Signed up</span>
            {groupSize > 1 && (
              <span className="text-info"> in a group of {groupSize}</span>
            )}
          </button>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-1 rounded-field border-2 border-base-100 bg-base-300 text-lg shadow-2xl"
            onClick={() => {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement?.blur();
              }
            }}
          >
            <li>
              <div
                className={
                  "text-warning hover:bg-warning hover:text-warning-content"
                }
                onClick={() => setModalOpen(true)}
              >
                Edit Application
              </div>
              {upcomingEvent.max_group_size > 1 && (
                <div onClick={() => setGroupModalOpen(true)}>Manage Group</div>
              )}
              <div
                className={"text-error hover:bg-error hover:text-error-content"}
                onClick={() => deleteSignup(upcomingEvent.id, user.id)}
              >
                Withdraw Application
              </div>
            </li>
          </ul>
        </div>
      </>
    );
  }

  if (eventStatus?.application_status === ApplicationStatus.none) {
    return (
      <>
        {dialog}
        <button
          className={"btn btn-lg btn-primary"}
          onClick={() => setModalOpen(true)}
        >
          Apply for Event
        </button>
      </>
    );
  }
}

export default SignupButton;
