import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  AddUsersToTeamsBaseBody,
  CreateObjectiveTeamSuggestionBase201,
  CreateObjectiveTeamSuggestionBaseBody,
  CreateTeamBaseBody,
  SaveMyTeamSheetEntryBaseBody,
  SortedUser,
  Team,
  TeamSheetEntry,
  TeamSuggestion,
} from "../models";

import { customFetch } from "../../fetcher.ts";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

const withQueryKey = <T extends object, K>(
  query: T,
  queryKey: K,
): T & { queryKey: K } => {
  const result = { queryKey } as T & { queryKey: K };
  for (const key of Object.keys(query)) {
    // The explicit queryKey always wins, matching the previous
    // `{ ...query, queryKey }` spread where it was set last.
    if (key === "queryKey") continue;
    Object.defineProperty(result, key, {
      enumerable: true,
      configurable: true,
      get: () => (query as Record<string, unknown>)[key],
    });
  }
  return result;
};

export const getGetTeamsBaseUrl = (eventId: number) => {
  return `/events/${eventId}/teams`;
};

/**
 * Fetches all teams for an event
 */
export const getTeamsBase = async (
  eventId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<Team[]> => {
  return customFetch<Team[]>(getGetTeamsBaseUrl(eventId), {
    ...options,
    method: "GET",
  });
};

export const getGetTeamsBaseQueryKey = (eventId: number) => {
  return [`/events/${eventId}/teams`] as const;
};

export const getGetTeamsBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getTeamsBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetTeamsBaseQueryKey(eventId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTeamsBase>>> = ({
    signal,
  }) => getTeamsBase(eventId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: eventId !== null && eventId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getTeamsBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetTeamsBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getTeamsBase>>
>;
export type GetTeamsBaseQueryError = unknown;

export function useGetTeamsBase<
  TData = Awaited<ReturnType<typeof getTeamsBase>>,
  TError = unknown,
>(
  eventId: number,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamsBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamsBase<
  TData = Awaited<ReturnType<typeof getTeamsBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamsBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamsBase<
  TData = Awaited<ReturnType<typeof getTeamsBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetTeamsBase<
  TData = Awaited<ReturnType<typeof getTeamsBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetTeamsBaseQueryOptions(eventId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getCreateTeamBaseUrl = (eventId: number) => {
  return `/events/${eventId}/teams`;
};

/**
 * Creates a team for an event
 */
export const createTeamBase = async (
  eventId: number,
  createTeamBaseBody: CreateTeamBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<Team> => {
  const getHeaders = (
    h?: NonNullable<RequestInit["headers"]>,
  ): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(
          h as Iterable<Iterable<string>>,
          (entry) => Array.from(entry) as [string, string],
        ),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<
      string | readonly string[] | undefined
    >(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
  return customFetch<Team>(getCreateTeamBaseUrl(eventId), {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(options?.headers),
    },
    body: JSON.stringify(createTeamBaseBody),
  });
};

export const getCreateTeamBaseMutationKey = () => ["createTeamBase"] as const;

export const getCreateTeamBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createTeamBase>>,
    TError,
    CreateTeamBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createTeamBase>>,
  TError,
  CreateTeamBaseMutationVariables,
  TContext
> => {
  const mutationKey = getCreateTeamBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createTeamBase>>,
    CreateTeamBaseMutationVariables
  > = (props) => {
    const { eventId, data } = props ?? {};

    return createTeamBase(eventId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateTeamBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof createTeamBase>>
>;
export type CreateTeamBaseMutationBody = CreateTeamBaseBody;
export type CreateTeamBaseMutationError = unknown;
export type CreateTeamBaseMutationVariables = {
  eventId: number;
  data: CreateTeamBaseBody;
};

export const useCreateTeamBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createTeamBase>>,
      TError,
      CreateTeamBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createTeamBase>>,
  TError,
  CreateTeamBaseMutationVariables,
  TContext
> => {
  return useMutation(getCreateTeamBaseMutationOptions(options), queryClient);
};
export const getGetSortedUsersBaseUrl = (eventId: number) => {
  return `/events/${eventId}/teams/users`;
};

/**
 * Fetches all users of an event sorted by team and role
 */
export const getSortedUsersBase = async (
  eventId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<SortedUser[]> => {
  return customFetch<SortedUser[]>(getGetSortedUsersBaseUrl(eventId), {
    ...options,
    method: "GET",
  });
};

export const getGetSortedUsersBaseQueryKey = (eventId: number) => {
  return [`/events/${eventId}/teams/users`] as const;
};

export const getGetSortedUsersBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getSortedUsersBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getSortedUsersBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetSortedUsersBaseQueryKey(eventId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getSortedUsersBase>>
  > = ({ signal }) =>
    getSortedUsersBase(eventId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: eventId !== null && eventId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getSortedUsersBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetSortedUsersBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSortedUsersBase>>
>;
export type GetSortedUsersBaseQueryError = unknown;

export function useGetSortedUsersBase<
  TData = Awaited<ReturnType<typeof getSortedUsersBase>>,
  TError = unknown,
>(
  eventId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getSortedUsersBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSortedUsersBase>>,
          TError,
          Awaited<ReturnType<typeof getSortedUsersBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetSortedUsersBase<
  TData = Awaited<ReturnType<typeof getSortedUsersBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getSortedUsersBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSortedUsersBase>>,
          TError,
          Awaited<ReturnType<typeof getSortedUsersBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetSortedUsersBase<
  TData = Awaited<ReturnType<typeof getSortedUsersBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getSortedUsersBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetSortedUsersBase<
  TData = Awaited<ReturnType<typeof getSortedUsersBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getSortedUsersBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetSortedUsersBaseQueryOptions(eventId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getAddUsersToTeamsBaseUrl = (eventId: number) => {
  return `/events/${eventId}/teams/users`;
};

/**
 * Adds users to teams
 */
export const addUsersToTeamsBase = async (
  eventId: number,
  addUsersToTeamsBaseBody: AddUsersToTeamsBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
  const getHeaders = (
    h?: NonNullable<RequestInit["headers"]>,
  ): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(
          h as Iterable<Iterable<string>>,
          (entry) => Array.from(entry) as [string, string],
        ),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<
      string | readonly string[] | undefined
    >(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
  return customFetch<void>(getAddUsersToTeamsBaseUrl(eventId), {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(options?.headers),
    },
    body: JSON.stringify(addUsersToTeamsBaseBody),
  });
};

export const getAddUsersToTeamsBaseMutationKey = () =>
  ["addUsersToTeamsBase"] as const;

export const getAddUsersToTeamsBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addUsersToTeamsBase>>,
    TError,
    AddUsersToTeamsBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof addUsersToTeamsBase>>,
  TError,
  AddUsersToTeamsBaseMutationVariables,
  TContext
> => {
  const mutationKey = getAddUsersToTeamsBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof addUsersToTeamsBase>>,
    AddUsersToTeamsBaseMutationVariables
  > = (props) => {
    const { eventId, data } = props ?? {};

    return addUsersToTeamsBase(eventId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AddUsersToTeamsBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof addUsersToTeamsBase>>
>;
export type AddUsersToTeamsBaseMutationBody = AddUsersToTeamsBaseBody;
export type AddUsersToTeamsBaseMutationError = unknown;
export type AddUsersToTeamsBaseMutationVariables = {
  eventId: number;
  data: AddUsersToTeamsBaseBody;
};

export const useAddUsersToTeamsBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof addUsersToTeamsBase>>,
      TError,
      AddUsersToTeamsBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof addUsersToTeamsBase>>,
  TError,
  AddUsersToTeamsBaseMutationVariables,
  TContext
> => {
  return useMutation(
    getAddUsersToTeamsBaseMutationOptions(options),
    queryClient,
  );
};
export const getDeleteTeamBaseUrl = (eventId: number, teamId: number) => {
  return `/events/${eventId}/teams/${teamId}`;
};

/**
 * Deletes a team
 */
export const deleteTeamBase = async (
  eventId: number,
  teamId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
  return customFetch<void>(getDeleteTeamBaseUrl(eventId, teamId), {
    ...options,
    method: "DELETE",
  });
};

export const getDeleteTeamBaseMutationKey = () => ["deleteTeamBase"] as const;

export const getDeleteTeamBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteTeamBase>>,
    TError,
    DeleteTeamBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteTeamBase>>,
  TError,
  DeleteTeamBaseMutationVariables,
  TContext
> => {
  const mutationKey = getDeleteTeamBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteTeamBase>>,
    DeleteTeamBaseMutationVariables
  > = (props) => {
    const { eventId, teamId } = props ?? {};

    return deleteTeamBase(eventId, teamId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteTeamBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteTeamBase>>
>;

export type DeleteTeamBaseMutationError = unknown;
export type DeleteTeamBaseMutationVariables = {
  eventId: number;
  teamId: number;
};

export const useDeleteTeamBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteTeamBase>>,
      TError,
      DeleteTeamBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteTeamBase>>,
  TError,
  DeleteTeamBaseMutationVariables,
  TContext
> => {
  return useMutation(getDeleteTeamBaseMutationOptions(options), queryClient);
};
export const getGetTeamBaseUrl = (eventId: number, teamId: number) => {
  return `/events/${eventId}/teams/${teamId}`;
};

/**
 * Fetches a team by id
 */
export const getTeamBase = async (
  eventId: number,
  teamId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<Team> => {
  return customFetch<Team>(getGetTeamBaseUrl(eventId, teamId), {
    ...options,
    method: "GET",
  });
};

export const getGetTeamBaseQueryKey = (eventId: number, teamId: number) => {
  return [`/events/${eventId}/teams/${teamId}`] as const;
};

export const getGetTeamBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetTeamBaseQueryKey(eventId, teamId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getTeamBase>>> = ({
    signal,
  }) => getTeamBase(eventId, teamId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled:
      eventId !== null &&
      eventId !== undefined &&
      teamId !== null &&
      teamId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getTeamBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetTeamBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getTeamBase>>
>;
export type GetTeamBaseQueryError = unknown;

export function useGetTeamBase<
  TData = Awaited<ReturnType<typeof getTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamBase<
  TData = Awaited<ReturnType<typeof getTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamBase<
  TData = Awaited<ReturnType<typeof getTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetTeamBase<
  TData = Awaited<ReturnType<typeof getTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetTeamBaseQueryOptions(eventId, teamId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getGetTeamSheetBaseUrl = (eventId: number, teamId: number) => {
  return `/events/${eventId}/teams/${teamId}/sheet`;
};

/**
 * Fetches the team sheet (planned characters/roles) for your team for an event
 */
export const getTeamSheetBase = async (
  eventId: number,
  teamId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<TeamSheetEntry[]> => {
  return customFetch<TeamSheetEntry[]>(
    getGetTeamSheetBaseUrl(eventId, teamId),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetTeamSheetBaseQueryKey = (
  eventId: number,
  teamId: number,
) => {
  return [`/events/${eventId}/teams/${teamId}/sheet`] as const;
};

export const getGetTeamSheetBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getTeamSheetBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSheetBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetTeamSheetBaseQueryKey(eventId, teamId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getTeamSheetBase>>
  > = ({ signal }) =>
    getTeamSheetBase(eventId, teamId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled:
      eventId !== null &&
      eventId !== undefined &&
      teamId !== null &&
      teamId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getTeamSheetBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetTeamSheetBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getTeamSheetBase>>
>;
export type GetTeamSheetBaseQueryError = unknown;

export function useGetTeamSheetBase<
  TData = Awaited<ReturnType<typeof getTeamSheetBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSheetBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamSheetBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamSheetBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamSheetBase<
  TData = Awaited<ReturnType<typeof getTeamSheetBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSheetBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamSheetBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamSheetBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamSheetBase<
  TData = Awaited<ReturnType<typeof getTeamSheetBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSheetBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetTeamSheetBase<
  TData = Awaited<ReturnType<typeof getTeamSheetBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSheetBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetTeamSheetBaseQueryOptions(
    eventId,
    teamId,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getSaveMyTeamSheetEntryBaseUrl = (
  eventId: number,
  teamId: number,
) => {
  return `/events/${eventId}/teams/${teamId}/sheet`;
};

/**
 * Creates or updates your own row in your team's sheet for an event
 */
export const saveMyTeamSheetEntryBase = async (
  eventId: number,
  teamId: number,
  saveMyTeamSheetEntryBaseBody: SaveMyTeamSheetEntryBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<TeamSheetEntry> => {
  const getHeaders = (
    h?: NonNullable<RequestInit["headers"]>,
  ): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(
          h as Iterable<Iterable<string>>,
          (entry) => Array.from(entry) as [string, string],
        ),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<
      string | readonly string[] | undefined
    >(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
  return customFetch<TeamSheetEntry>(
    getSaveMyTeamSheetEntryBaseUrl(eventId, teamId),
    {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(options?.headers),
      },
      body: JSON.stringify(saveMyTeamSheetEntryBaseBody),
    },
  );
};

export const getSaveMyTeamSheetEntryBaseMutationKey = () =>
  ["saveMyTeamSheetEntryBase"] as const;

export const getSaveMyTeamSheetEntryBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof saveMyTeamSheetEntryBase>>,
    TError,
    SaveMyTeamSheetEntryBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof saveMyTeamSheetEntryBase>>,
  TError,
  SaveMyTeamSheetEntryBaseMutationVariables,
  TContext
> => {
  const mutationKey = getSaveMyTeamSheetEntryBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof saveMyTeamSheetEntryBase>>,
    SaveMyTeamSheetEntryBaseMutationVariables
  > = (props) => {
    const { eventId, teamId, data } = props ?? {};

    return saveMyTeamSheetEntryBase(eventId, teamId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type SaveMyTeamSheetEntryBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof saveMyTeamSheetEntryBase>>
>;
export type SaveMyTeamSheetEntryBaseMutationBody = SaveMyTeamSheetEntryBaseBody;
export type SaveMyTeamSheetEntryBaseMutationError = unknown;
export type SaveMyTeamSheetEntryBaseMutationVariables = {
  eventId: number;
  teamId: number;
  data: SaveMyTeamSheetEntryBaseBody;
};

export const useSaveMyTeamSheetEntryBase = <
  TError = unknown,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof saveMyTeamSheetEntryBase>>,
      TError,
      SaveMyTeamSheetEntryBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof saveMyTeamSheetEntryBase>>,
  TError,
  SaveMyTeamSheetEntryBaseMutationVariables,
  TContext
> => {
  return useMutation(
    getSaveMyTeamSheetEntryBaseMutationOptions(options),
    queryClient,
  );
};
export const getGetTeamSuggestionsBaseUrl = (
  eventId: number,
  teamId: number,
) => {
  return `/events/${eventId}/teams/${teamId}/suggestions`;
};

/**
 * Fetches all suggestions for your team for an event
 */
export const getTeamSuggestionsBase = async (
  eventId: number,
  teamId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<TeamSuggestion[]> => {
  return customFetch<TeamSuggestion[]>(
    getGetTeamSuggestionsBaseUrl(eventId, teamId),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetTeamSuggestionsBaseQueryKey = (
  eventId: number,
  teamId: number,
) => {
  return [`/events/${eventId}/teams/${teamId}/suggestions`] as const;
};

export const getGetTeamSuggestionsBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetTeamSuggestionsBaseQueryKey(eventId, teamId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getTeamSuggestionsBase>>
  > = ({ signal }) =>
    getTeamSuggestionsBase(eventId, teamId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled:
      eventId !== null &&
      eventId !== undefined &&
      teamId !== null &&
      teamId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetTeamSuggestionsBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getTeamSuggestionsBase>>
>;
export type GetTeamSuggestionsBaseQueryError = unknown;

export function useGetTeamSuggestionsBase<
  TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamSuggestionsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamSuggestionsBase<
  TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamSuggestionsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamSuggestionsBase<
  TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetTeamSuggestionsBase<
  TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetTeamSuggestionsBaseQueryOptions(
    eventId,
    teamId,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getDeleteObjectiveTeamSuggestionBaseUrl = (
  eventId: number,
  teamId: number,
  objectiveId: number,
) => {
  return `/events/${eventId}/teams/${teamId}/suggestions/${objectiveId}`;
};

/**
 * Deletes a suggestion for an objective for your team for an event
 */
export const deleteObjectiveTeamSuggestionBase = async (
  eventId: number,
  teamId: number,
  objectiveId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
  return customFetch<void>(
    getDeleteObjectiveTeamSuggestionBaseUrl(eventId, teamId, objectiveId),
    {
      ...options,
      method: "DELETE",
    },
  );
};

export const getDeleteObjectiveTeamSuggestionBaseMutationKey = () =>
  ["deleteObjectiveTeamSuggestionBase"] as const;

export const getDeleteObjectiveTeamSuggestionBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>,
    TError,
    DeleteObjectiveTeamSuggestionBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>,
  TError,
  DeleteObjectiveTeamSuggestionBaseMutationVariables,
  TContext
> => {
  const mutationKey = getDeleteObjectiveTeamSuggestionBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>,
    DeleteObjectiveTeamSuggestionBaseMutationVariables
  > = (props) => {
    const { eventId, teamId, objectiveId } = props ?? {};

    return deleteObjectiveTeamSuggestionBase(
      eventId,
      teamId,
      objectiveId,
      requestOptions,
    );
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteObjectiveTeamSuggestionBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>
>;

export type DeleteObjectiveTeamSuggestionBaseMutationError = unknown;
export type DeleteObjectiveTeamSuggestionBaseMutationVariables = {
  eventId: number;
  teamId: number;
  objectiveId: number;
};

export const useDeleteObjectiveTeamSuggestionBase = <
  TError = unknown,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>,
      TError,
      DeleteObjectiveTeamSuggestionBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>,
  TError,
  DeleteObjectiveTeamSuggestionBaseMutationVariables,
  TContext
> => {
  return useMutation(
    getDeleteObjectiveTeamSuggestionBaseMutationOptions(options),
    queryClient,
  );
};
export const getCreateObjectiveTeamSuggestionBaseUrl = (
  eventId: number,
  teamId: number,
  objectiveId: number,
) => {
  return `/events/${eventId}/teams/${teamId}/suggestions/${objectiveId}`;
};

/**
 * Creates a suggestion for an objective for your team for an event
 */
export const createObjectiveTeamSuggestionBase = async (
  eventId: number,
  teamId: number,
  objectiveId: number,
  createObjectiveTeamSuggestionBaseBody: CreateObjectiveTeamSuggestionBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<CreateObjectiveTeamSuggestionBase201> => {
  const getHeaders = (
    h?: NonNullable<RequestInit["headers"]>,
  ): Record<string, string | readonly string[]> => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(
          h as Iterable<Iterable<string>>,
          (entry) => Array.from(entry) as [string, string],
        ),
      );
    }
    const headers: Record<string, string | readonly string[]> = {};
    for (const [name, value] of Object.entries<
      string | readonly string[] | undefined
    >(h)) {
      if (value !== undefined) headers[name] = value;
    }
    return headers;
  };
  return customFetch<CreateObjectiveTeamSuggestionBase201>(
    getCreateObjectiveTeamSuggestionBaseUrl(eventId, teamId, objectiveId),
    {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(options?.headers),
      },
      body: JSON.stringify(createObjectiveTeamSuggestionBaseBody),
    },
  );
};

export const getCreateObjectiveTeamSuggestionBaseMutationKey = () =>
  ["createObjectiveTeamSuggestionBase"] as const;

export const getCreateObjectiveTeamSuggestionBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>,
    TError,
    CreateObjectiveTeamSuggestionBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>,
  TError,
  CreateObjectiveTeamSuggestionBaseMutationVariables,
  TContext
> => {
  const mutationKey = getCreateObjectiveTeamSuggestionBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>,
    CreateObjectiveTeamSuggestionBaseMutationVariables
  > = (props) => {
    const { eventId, teamId, objectiveId, data } = props ?? {};

    return createObjectiveTeamSuggestionBase(
      eventId,
      teamId,
      objectiveId,
      data,
      requestOptions,
    );
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateObjectiveTeamSuggestionBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>
>;
export type CreateObjectiveTeamSuggestionBaseMutationBody =
  CreateObjectiveTeamSuggestionBaseBody;
export type CreateObjectiveTeamSuggestionBaseMutationError = unknown;
export type CreateObjectiveTeamSuggestionBaseMutationVariables = {
  eventId: number;
  teamId: number;
  objectiveId: number;
  data: CreateObjectiveTeamSuggestionBaseBody;
};

export const useCreateObjectiveTeamSuggestionBase = <
  TError = unknown,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>,
      TError,
      CreateObjectiveTeamSuggestionBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>,
  TError,
  CreateObjectiveTeamSuggestionBaseMutationVariables,
  TContext
> => {
  return useMutation(
    getCreateObjectiveTeamSuggestionBaseMutationOptions(options),
    queryClient,
  );
};
