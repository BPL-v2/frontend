import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useGetEventActivitiesBase, useGetEventActivitiesForUserBase } from "./generated/activity/activity";
import { useGetTeamAtlasesForEventBase } from "./generated/atlas/atlas";
import { useDeletePoBExportBase, useGetCharacterHistoryBase, useGetPoBsBase, useGetUserCharactersBase } from "./generated/characters/characters";
import { useCreateEventBase, useDeleteEventBase, useDuplicateEventBase, useGetEventStatusBase, useGetEventsBase } from "./generated/event/event";
import { useGetGuildStashForUserBase, useGetGuildStashTabBase, useGetGuildsBase, useGetLogEntriesForGuildBase, useSwitchStashFetchingBase, useUpdateStashTabBase } from "./generated/guild-stash/guild-stash";
import { useChangeItemWishBase, useCreateItemWishBase, useDeleteItemWishBase, useGetItemWishesForTeamBase } from "./generated/item-wishes/item-wishes";
import { useGetItemMapBase } from "./generated/items/items";
import { useGetJobsBase, useStartJobBase } from "./generated/jobs/jobs";
import { useGetLadderBase } from "./generated/ladder/ladder";
import { createObjectiveBase, useCreateObjectiveBase, useDeleteObjectiveBase, useGetObjectiveTreeForEventBase, useGetObjectiveValidationsBase, useGetValidMappingsBase } from "./generated/objective/objective";
import { useGetLatestScoresForEventBase } from "./generated/scores/scores";
import { useCreateScoringPresetBase, useDeleteScoringPresetBase, useGetScoringPresetsForEventBase } from "./generated/scoring/scoring";
import { useCreateSignupBase, useDeleteSignupBase, useGetEventSignupsBase, useGetPersonalSignupBase } from "./generated/signup/signup";
import { useGetStreamsBase } from "./generated/streams/streams";
import { useGetSubmissionsBase, useReviewSubmissionBase, useSubmitBountyBase } from "./generated/submission/submission";
import { useAddUsersToTeamsBase, useCreateObjectiveTeamSuggestionBase, useCreateTeamBase, useDeleteObjectiveTeamSuggestionBase, useDeleteTeamBase, useGetSortedUsersBase, useGetTeamSuggestionsBase } from "./generated/team/team";
import { useGetTimingsBase, useSetTimingsBase } from "./generated/timing/timing";
import { useGetAtlasProgressionBase, useGetUserBase, useGetUserByIdBase, useGetUsersForEventBase, useRemoveAuthBase, useUpdateUserBase } from "./generated/user/user";
import type { BulkObjectiveCreate } from "@components/form-dialogs/BulkObjectiveFormModal";
import { ItemField, NumberField, Objective, ObjectiveCreate, ObjectiveType, Operator } from "./generated/models";
import type { ScoreMap } from "@utils/utils";
import { flatMap } from "@utils/utils";
import { isLoggedIn } from "@utils/token";

// --- Events ---

export function useGetEvents() {
  const query = useGetEventsBase({
    query: {
      select: (data) => data.sort((a, b) => a.id - b.id),
    },
  });
  return { ...query, events: query.data ?? [] };
}

export function useCreateEvent(qc: QueryClient, callback?: () => void) {
  const m = useCreateEventBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/events"] });
        callback?.();
      },
    },
  });
  return { createEvent: m.mutate, createEventPending: m.isPending };
}

export function useDeleteEvent(qc: QueryClient, callback?: () => void) {
  const m = useDeleteEventBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/events"] });
        callback?.();
      },
    },
  });
  return { deleteEvent: m.mutate, deleteEventPending: m.isPending };
}

export function useDuplicateEvent(qc: QueryClient) {
  const m = useDuplicateEventBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/events"] });
      },
    },
  });
  return { duplicateEvent: m.mutate, duplicateEventPending: m.isPending };
}

export function useGetEventStatus(eventId: number) {
  const query = useGetEventStatusBase(eventId, {
    query: { refetchOnMount: false },
  });
  return { ...query, eventStatus: query.data };
}

// --- Ladder ---

export function useGetLadder(eventId: number, hoursAfterEventStart?: number) {
  const query = useGetLadderBase(
    eventId,
    { hours_after_event_start: hoursAfterEventStart },
    { query: { refetchInterval: 60 * 1000, staleTime: 60 * 1000 } },
  );
  return { ...query, ladder: query.data };
}

// --- Users ---

export function useGetUsers(eventId: number) {
  const query = useGetUsersForEventBase(eventId, {
    query: {
      refetchOnMount: false,
      select: (data) =>
        Object.entries(data)
          .flatMap(([teamId, users]) =>
            users.map((u) => ({ ...u, team_id: parseInt(teamId) })),
          ),
    },
  });
  return { ...query, users: query.data };
}

export function useGetUser() {
  const query = useGetUserBase({
    query: {
      enabled: () => isLoggedIn(),
      refetchOnMount: false,
      select: (user) => {
        if (new Date(user.token_expiry_timestamp || 0) < new Date()) {
          localStorage.removeItem("auth");
          return null;
        }
        return user;
      },
    },
  });
  return { ...query, user: query.data };
}

export function useGetUserById(userId: number) {
  const query = useGetUserByIdBase(userId, {
    query: { enabled: !!userId },
  });
  return { ...query, user: query.data };
}

export function useChangeUserDisplayName(qc: QueryClient) {
  const m = useUpdateUserBase({
    mutation: {
      onSuccess: (data) => qc.setQueryData(["/users/self"], data),
    },
  });
  return { changeUserDisplayName: m.mutate, changeUserDisplayNamePending: m.isPending };
}

export function useRemoveOauthProvider(qc: QueryClient) {
  const m = useRemoveAuthBase({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: ["/users/self"] }),
    },
  });
  return { removeOauthProvider: m.mutate, removeOauthProviderPending: m.isPending };
}

// --- Streams ---

export function useGetStreams(eventId: number) {
  const query = useGetStreamsBase(eventId);
  return { ...query, streams: query.data };
}

// --- Signups ---

export function useGetSignups(eventId: number) {
  const query = useGetEventSignupsBase(eventId);
  return { ...query, signups: query.data };
}

export function useGetOwnSignup(eventId: number) {
  const query = useGetPersonalSignupBase(eventId, {
    query: { retry: false, enabled: isLoggedIn(), refetchOnMount: false },
  });
  return { signup: query.data };
}

export function useCreateSignup(
  qc: QueryClient,
  successCallback?: () => void,
  errorCallback?: (msg: string) => void,
) {
  const m = useCreateSignupBase({
    mutation: {
      onSuccess: (data, { eventId }) => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/status`] });
        qc.setQueryData([`/events/${eventId}/signups/self`], data);
        successCallback?.();
      },
      onError: async (error) => {
        if (errorCallback) {
          let errorMessage = "An error occurred";
          if (error instanceof Error) errorMessage = error.message;
          errorCallback(errorMessage);
        }
      },
    },
  });
  return { ...m, createSignup: m.mutate, createSignupPending: m.isPending };
}

export function useDeleteSignup(qc: QueryClient) {
  const m = useDeleteSignupBase({
    mutation: {
      onSuccess: (_, { eventId }) => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/status`] });
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/signups`] });
      },
    },
  });
  return { deleteSignup: m.mutate, deleteSignupPending: m.isPending };
}

// --- Teams ---

export function useAddUsersToTeams(qc: QueryClient) {
  const m = useAddUsersToTeamsBase({
    mutation: {
      onSuccess: (_, { eventId }) => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/signups`] });
      },
    },
  });
  return { addUsersToTeams: m.mutate, addUsersToTeamsPending: m.isPending };
}

export function useCreateTeam(qc: QueryClient, eventId: number, callback?: () => void) {
  const m = useCreateTeamBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/events"] });
        callback?.();
      },
    },
  });
  return { createTeam: m.mutate, createTeamPending: m.isPending };
}

export function useDeleteTeam(qc: QueryClient, eventId: number) {
  const m = useDeleteTeamBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/events"] });
      },
    },
  });
  return { deleteTeam: m.mutate, deleteTeamPending: m.isPending };
}

export function useGetSortedPlayers(eventId: number) {
  const query = useGetSortedUsersBase(eventId, {
    query: { enabled: !!eventId },
  });
  return { ...query, sortedPlayers: query.data };
}

export function useGetTeamGoals(eventId: number, teamId?: number) {
  const query = useGetTeamSuggestionsBase(eventId, teamId!, {
    query: { enabled: () => isLoggedIn() && !!teamId },
  });
  return { ...query, teamGoals: query.data };
}

export function useAddTeamSuggestion(eventId: number, queryClient: QueryClient) {
  const mutation = useCreateObjectiveTeamSuggestionBase({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/events/${eventId}/teams`] });
      },
    },
  });
  return { addTeamSuggestion: mutation.mutate, ...mutation };
}

export function useDeleteTeamSuggestion(eventId: number, queryClient: QueryClient) {
  const mutation = useDeleteObjectiveTeamSuggestionBase({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/events/${eventId}/teams`] });
      },
    },
  });
  return { deleteTeamSuggestion: mutation.mutate, ...mutation };
}

// --- Objectives ---

export function useGetRules(eventId: number) {
  const query = useGetObjectiveTreeForEventBase(eventId, {
    query: { refetchOnMount: false },
  });
  return { ...query, rules: query.data };
}

export function useGetValidConditionMappings(eventId: number) {
  const query = useGetValidMappingsBase(eventId, {
    query: { enabled: !!eventId },
  });
  return {
    ...query,
    operatorForField: Object.entries(query.data?.field_to_type ?? {}).reduce(
      (acc, [key, value]) => {
        acc[key as ItemField] = query.data?.valid_operators[value] ?? [];
        return acc;
      },
      {} as { [key in ItemField]: Operator[] },
    ),
    numberFieldsForObjectiveType: query.data?.objective_type_to_number_fields as {
      [key in ObjectiveType]: NumberField[];
    },
  };
}

export function useGetObjectiveValidations(eventId: number) {
  const query = useGetObjectiveValidationsBase(eventId, {
    query: { enabled: !!eventId },
  });
  return { ...query, objectiveValidations: query.data ?? [] };
}

export function useCreateObjective(qc: QueryClient, eventId: number, callback?: () => void) {
  const m = useCreateObjectiveBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/objectives`] });
        callback?.();
      },
    },
  });
  return { createObjective: m.mutate, createObjectivePending: m.isPending };
}

export function useDeleteObjective(qc: QueryClient, eventId: number) {
  const m = useDeleteObjectiveBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/objectives`] });
      },
    },
  });
  return { deleteObjective: m.mutate, deleteObjectivePending: m.isPending };
}

export function useCreateBulkObjectives(
  qc: QueryClient,
  eventId: number,
  categoryId: number,
  callback?: () => void,
) {
  const m = useMutation({
    mutationFn: (bulkObjective: BulkObjectiveCreate) => {
      const objectives: ObjectiveCreate[] = bulkObjective.nameList
        .split(",")
        .map((name) => ({
          name: name.trim(),
          required_number: 1,
          objective_type: ObjectiveType.ITEM,
          aggregation: bulkObjective.aggregation_method,
          number_field: NumberField.STACK_SIZE,
          scoring_preset_ids: bulkObjective.scoring_preset_ids,
          parent_id: categoryId,
          conditions: [{ field: bulkObjective.item_field, operator: Operator.EQ, value: name }],
        }));
      return Promise.all(objectives.map((obj) => createObjectiveBase(eventId, obj)));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`/events/${eventId}/objectives`] });
      callback?.();
    },
  });
  return { createBulkObjectives: m.mutate, createBulkObjectivesPending: m.isPending };
}

export function useChangeCategoryReleaseDates(qc: QueryClient, eventId: number) {
  const m = useMutation({
    mutationFn: ({ objective, start, end }: { objective: Objective; start: Date | null; end: Date | null }) => {
      const promises = (flatMap(objective as any) as Objective[]).map((child) =>
        createObjectiveBase(eventId, toObjectiveCreate(child, start, end)),
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`/events/${eventId}/objectives`] });
    },
  });
  return { changeCategoryReleaseDates: m.mutate, changeCategoryReleaseDatesPending: m.isPending };
}

// --- Scoring presets ---

export function useGetScoringPresets(eventId: number) {
  const query = useGetScoringPresetsForEventBase(eventId);
  return { ...query, scoringPresets: query.data };
}

export function useGetScoringPresetsForEvent(eventId: number) {
  const query = useGetScoringPresetsForEventBase(eventId, {
    query: {
      enabled: !!eventId,
      select: (data) => data.sort((a, b) => a.id - b.id),
    },
  });
  return { ...query, scoringPresets: query.data ?? [] };
}

export function useAddScoringPreset(qc: QueryClient, eventId: number, callback?: () => void) {
  const m = useCreateScoringPresetBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/scoring-presets`] });
        callback?.();
      },
    },
  });
  return { addScoringPreset: m.mutate, addScoringPresetPending: m.isPending };
}

export function useDeleteScoringPreset(qc: QueryClient, eventId: number) {
  const m = useDeleteScoringPresetBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/scoring-presets`] });
      },
    },
  });
  return { deleteScoringPreset: m.mutate, deleteScoringPresetPending: m.isPending };
}

// --- Submissions ---

export function useGetSubmissions(eventId: number) {
  const query = useGetSubmissionsBase(eventId, {
    query: { enabled: !!eventId },
  });
  return { ...query, submissions: query.data ?? [] };
}

export function useSubmitBounty(qc: QueryClient, eventId: number) {
  const m = useSubmitBountyBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/submissions`] });
      },
    },
  });
  return { submitBounty: m.mutate, submitBountyPending: m.isPending };
}

export function useReviewSubmission(qc: QueryClient, eventId: number) {
  const m = useReviewSubmissionBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/submissions`] });
      },
    },
  });
  return { ...m, reviewSubmission: m.mutate, reviewSubmissionPending: m.isPending };
}

// --- Guild stash ---

export function useGetGuildStash(eventId: number, teamId: number) {
  const query = useGetGuildStashForUserBase(eventId, teamId, {
    query: {
      enabled: () => teamId !== 0 && isLoggedIn(),
      retry: false,
      refetchInterval: 60 * 1000,
      select: (data) => data.sort((a, b) => (a.index || 0) - (b.index || 0)),
    },
  });
  return { ...query, guildStashes: query.data };
}

export function useGetGuildStashTab(eventId: number, teamId: number, tabId: string) {
  const query = useGetGuildStashTabBase(eventId, teamId, tabId, {
    query: {
      enabled: () => teamId !== 0 && isLoggedIn(),
      refetchInterval: 60 * 1000,
    },
  });
  return { ...query, guildStashTab: query.data };
}

export function useUpdateGuildStashTab(qc: QueryClient, eventId: number, teamId: number) {
  const m = useUpdateStashTabBase({
    mutation: {
      onSuccess: (_, { stashId }) => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/guild-stash/${teamId}/${stashId}`] });
      },
    },
  });
  return { updateGuildStashTab: m.mutate, updateGuildStashTabPending: m.isPending };
}

export function useSwitchStashFetching(qc: QueryClient, eventId: number, teamId: number) {
  const m = useSwitchStashFetchingBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/guild-stash/${teamId}`] });
      },
    },
  });
  return { switchStashFetching: m.mutate, switchStashFetchingPending: m.isPending };
}

export function useGetGuildLogs(eventId: number, guildId: number) {
  const query = useGetLogEntriesForGuildBase(eventId, guildId);
  return { ...query, logs: query.data };
}

export function useGetGuilds(eventId: number) {
  const query = useGetGuildsBase(eventId);
  return { ...query, guilds: query.data };
}

// --- Characters ---

export function useGetUserCharacters(userId: number) {
  const query = useGetUserCharactersBase(userId, {
    query: {
      enabled: !!userId,
      refetchOnMount: false,
      select: (data) => {
        const byEvent = data.reduce(
          (acc, character) => {
            if (!acc[character.event_id]) acc[character.event_id] = [];
            acc[character.event_id].push(character);
            return acc;
          },
          {} as { [eventId: number]: (typeof data)[number][] },
        );
        return Object.values(byEvent).map(
          (chars) => chars.sort((a, b) => b.level - a.level)[0],
        );
      },
    },
  });
  return { ...query, userCharacters: query.data };
}

export function useGetCharacterTimeseries(characterId: string, userId: number) {
  const query = useGetCharacterHistoryBase(userId, characterId, {
    query: {
      enabled: !!userId && !!characterId,
      staleTime: 5 * 60 * 1000,
      select: (data) => data.sort((a, b) => a.timestamp - b.timestamp),
    },
  });
  return { ...query, characterTimeseries: query.data };
}

export function useGetPoBs(userId: number, characterId: string) {
  const query = useGetPoBsBase(userId, characterId, {
    query: {
      enabled: !!userId && !!characterId,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  });
  return { ...query, pobs: query.data };
}

export function useDeletePoB(qc: QueryClient) {
  const m = useDeletePoBExportBase({
    mutation: {
      onSuccess: (_, { userId, characterId }) => {
        qc.invalidateQueries({ queryKey: [`/events/${userId}/users/${characterId}/pob`] });
      },
    },
  });
  return { deletePoB: m.mutate, deletePoBPending: m.isPending };
}

// --- Scores ---

export function useGetScore(eventId: number) {
  const query = useGetLatestScoresForEventBase(eventId, {
    query: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
      select: (scoreDiffs) =>
        scoreDiffs.reduce((acc, diff) => {
          if (!acc[diff.team_id]) acc[diff.team_id] = {};
          acc[diff.team_id][diff.objective_id] = diff.score;
          return acc;
        }, {} as ScoreMap),
    },
  });
  return { ...query, score: query.data };
}

// --- Jobs ---

export function useGetJobs() {
  const query = useGetJobsBase();
  return { ...query, jobs: query.data ?? [] };
}

export function useStartJob(qc: QueryClient) {
  const m = useStartJobBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/jobs"] });
      },
    },
  });
  return { ...m, startJob: m.mutate, startJobPending: m.isPending };
}

// --- Timings ---

export function useGetTimings() {
  const query = useGetTimingsBase();
  return { ...query, timings: query.data ?? [] };
}

export function useSetTimings(qc: QueryClient) {
  const m = useSetTimingsBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["/timings"] });
      },
    },
  });
  return { setTimings: m.mutate, setTimingsPending: m.isPending };
}

// --- Activity ---

export function useGetActivitiesForEvent(eventId: number) {
  const query = useGetEventActivitiesBase(eventId);
  return { ...query, activities: query.data ?? [] };
}

export function useGetUserActivity(eventId: number, userId: number) {
  const query = useGetEventActivitiesForUserBase(eventId, userId, undefined, {
    query: {
      enabled: userId !== 0,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  });
  return { ...query, activity: query.data };
}

// --- Atlas ---

export function useGetTeamAtlas(eventId: number, teamId?: number) {
  const query = useGetTeamAtlasesForEventBase(eventId, teamId!, {
    query: {
      enabled: () => isLoggedIn() && !!teamId,
      refetchOnMount: false,
    },
  });
  return { ...query, teamAtlas: query.data };
}

export function useGetUserAtlasProgress(eventId: number, userId: number) {
  const query = useGetAtlasProgressionBase(eventId, userId, {
    query: { enabled: !!userId, refetchOnMount: false },
  });
  return { ...query, atlasProgress: query.data };
}

// --- Item wishes ---

export function useGetWishlist(eventId: number, teamId?: number) {
  const query = useGetItemWishesForTeamBase(eventId, teamId!, {
    query: { enabled: !!eventId && !!teamId },
  });
  return { ...query, wishlist: query.data };
}

export function useCreateItemWish(qc: QueryClient, eventId: number, teamId?: number) {
  const m = useCreateItemWishBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/teams/${teamId}/item_wishes`] });
      },
    },
  });
  return { saveItemWish: m.mutate, saveItemWishPending: m.isPending };
}

export function useUpdateItemWish(qc: QueryClient, eventId: number, teamId?: number) {
  const m = useChangeItemWishBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/teams/${teamId}/item_wishes`] });
      },
    },
  });
  return { updateItemWish: m.mutate, updateItemWishPending: m.isPending };
}

export function useDeleteItemWish(qc: QueryClient, eventId: number, teamId?: number) {
  const m = useDeleteItemWishBase({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [`/events/${eventId}/teams/${teamId}/item_wishes`] });
      },
    },
  });
  return { deleteItemWish: m.mutate, deleteItemWishPending: m.isPending };
}

// --- Items ---

export function useGetItemMapping() {
  const query = useGetItemMapBase({ query: { refetchOnMount: false } });
  return { ...query, itemMapping: query.data };
}

// --- Utility ---

export function useFile<T>(filePath: string, format: "text" | "json" = "json") {
  return useQuery({
    queryKey: [filePath],
    queryFn: async () =>
      fetch(filePath).then((res) => {
        if (format === "json") return res.json() as Promise<T>;
        return res.text() as Promise<T>;
      }),
    refetchOnMount: false,
  });
}

// --- Helpers ---

function toObjectiveCreate(
  objective: Objective,
  start: Date | null,
  end: Date | null,
): ObjectiveCreate {
  return {
    ...objective,
    valid_from: start ?? undefined,
    valid_to: end ?? undefined,
    scoring_preset_ids: objective.scoring_presets?.map((preset) => preset.id) ?? [],
  };
}
