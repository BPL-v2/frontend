import React, { useContext, useMemo } from "react";
import { GlobalStateContext } from "@utils/context-provider";
import { ApplicationStatus } from "@client/api";
import { TeamName } from "./team/team-name";
import {
  useDeleteSignup,
  useGetEvents,
  useGetEventStatus,
  useGetUser,
} from "@client/query";
import { useQueryClient } from "@tanstack/react-query";
import { SignupFormModal } from "@components/form-dialogs/SignupFormModal";

const SignupButton = () => {
  const { currentEvent } = useContext(GlobalStateContext);
  const [modalOpen, setModalOpen] = React.useState(false);
  const qc = useQueryClient();
  const { user, isLoading: userLoading, isError: userError } = useGetUser();
  const { events } = useGetEvents();
  const upcomingEvent =
    events?.sort((a, b) => {
      return (
        (Date.parse(b.event_start_time) || 0) -
        (Date.parse(a.event_start_time) || 0)
      );
    })[0] || currentEvent;
  const { eventStatus, isError: eventStatusError } = useGetEventStatus(
    upcomingEvent.id,
  );
  const { deleteSignup } = useDeleteSignup(qc);

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
    new Date(upcomingEvent.application_start_time) > new Date()
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
  const partner = eventStatus?.partner_wish;
  const partnerConfirmed = eventStatus?.users_who_want_to_sign_up_with_you
    ?.map((u) => u.toLowerCase().split("#")[0])
    ?.includes(partner?.toLowerCase().split("#")[0] || "");

  if (eventStatus?.application_status === ApplicationStatus.applied) {
    return (
      <>
        {dialog}
        <div className="dropdown">
          <button className={"cursor-pointer underline"}>
            <span className="text-2xl">
              Signed up {partnerConfirmed && "with "}
            </span>
            {partnerConfirmed && <span className="text-info">{partner}</span>}
            {partner && !partnerConfirmed && (
              <span className="text-warning">
                ({partner} has not confirmed yet)
              </span>
            )}
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu z-1 rounded-field border-2 border-base-100 bg-base-300 text-lg shadow-2xl"
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
              <div
                className={"text-error hover:bg-error hover:text-error-content"}
                onClick={() =>
                  deleteSignup({ eventId: upcomingEvent.id, userId: user.id })
                }
              >
                Withdraw Application
              </div>
            </li>
          </ul>
        </div>
      </>
    );
  }

  if (
    new Date() > new Date(upcomingEvent.application_end_time) ||
    new Date() < new Date(upcomingEvent.application_start_time)
  ) {
    return;
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
};

export default SignupButton;
