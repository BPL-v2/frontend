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

import type { Character, CharacterStat, GGGCharacter, PoB } from "../models";

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

export const getGetCharactersForEventBaseUrl = (eventId: number) => {
  return `/events/${eventId}/characters`;
};

/**
 * Get all characters for an event
 */
export const getCharactersForEventBase = async (
  eventId: number,
  options?: RequestInit,
): Promise<Character[]> => {
  return customFetch<Character[]>(getGetCharactersForEventBaseUrl(eventId), {
    ...options,
    method: "GET",
  });
};

export const getGetCharactersForEventBaseQueryKey = (eventId: number) => {
  return [`/events/${eventId}/characters`] as const;
};

export const getGetCharactersForEventBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getCharactersForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharactersForEventBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetCharactersForEventBaseQueryKey(eventId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getCharactersForEventBase>>
  > = ({ signal }) =>
    getCharactersForEventBase(eventId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: eventId !== null && eventId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getCharactersForEventBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetCharactersForEventBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCharactersForEventBase>>
>;
export type GetCharactersForEventBaseQueryError = unknown;

export function useGetCharactersForEventBase<
  TData = Awaited<ReturnType<typeof getCharactersForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharactersForEventBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCharactersForEventBase>>,
          TError,
          Awaited<ReturnType<typeof getCharactersForEventBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCharactersForEventBase<
  TData = Awaited<ReturnType<typeof getCharactersForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharactersForEventBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCharactersForEventBase>>,
          TError,
          Awaited<ReturnType<typeof getCharactersForEventBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCharactersForEventBase<
  TData = Awaited<ReturnType<typeof getCharactersForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharactersForEventBase>>,
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

export function useGetCharactersForEventBase<
  TData = Awaited<ReturnType<typeof getCharactersForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharactersForEventBase>>,
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
  const queryOptions = getGetCharactersForEventBaseQueryOptions(
    eventId,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getGetUserCharactersBaseUrl = (userId: number) => {
  return `/users/${userId}/characters`;
};

/**
 * Fetches all event characters for a user
 */
export const getUserCharactersBase = async (
  userId: number,
  options?: RequestInit,
): Promise<Character[]> => {
  return customFetch<Character[]>(getGetUserCharactersBaseUrl(userId), {
    ...options,
    method: "GET",
  });
};

export const getGetUserCharactersBaseQueryKey = (userId: number) => {
  return [`/users/${userId}/characters`] as const;
};

export const getGetUserCharactersBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getUserCharactersBase>>,
  TError = unknown,
>(
  userId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserCharactersBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetUserCharactersBaseQueryKey(userId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getUserCharactersBase>>
  > = ({ signal }) =>
    getUserCharactersBase(userId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: userId !== null && userId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getUserCharactersBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetUserCharactersBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUserCharactersBase>>
>;
export type GetUserCharactersBaseQueryError = unknown;

export function useGetUserCharactersBase<
  TData = Awaited<ReturnType<typeof getUserCharactersBase>>,
  TError = unknown,
>(
  userId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserCharactersBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserCharactersBase>>,
          TError,
          Awaited<ReturnType<typeof getUserCharactersBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetUserCharactersBase<
  TData = Awaited<ReturnType<typeof getUserCharactersBase>>,
  TError = unknown,
>(
  userId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserCharactersBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserCharactersBase>>,
          TError,
          Awaited<ReturnType<typeof getUserCharactersBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetUserCharactersBase<
  TData = Awaited<ReturnType<typeof getUserCharactersBase>>,
  TError = unknown,
>(
  userId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserCharactersBase>>,
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

export function useGetUserCharactersBase<
  TData = Awaited<ReturnType<typeof getUserCharactersBase>>,
  TError = unknown,
>(
  userId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserCharactersBase>>,
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
  const queryOptions = getGetUserCharactersBaseQueryOptions(userId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getGetCharacterHistoryBaseUrl = (
  userId: number,
  characterId: string,
) => {
  return `/users/${userId}/characters/${characterId}`;
};

/**
 * Get all character data for an event for a user
 */
export const getCharacterHistoryBase = async (
  userId: number,
  characterId: string,
  options?: RequestInit,
): Promise<CharacterStat[]> => {
  return customFetch<CharacterStat[]>(
    getGetCharacterHistoryBaseUrl(userId, characterId),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetCharacterHistoryBaseQueryKey = (
  userId: number,
  characterId: string,
) => {
  return [`/users/${userId}/characters/${characterId}`] as const;
};

export const getGetCharacterHistoryBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getCharacterHistoryBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharacterHistoryBase>>,
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
    getGetCharacterHistoryBaseQueryKey(userId, characterId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getCharacterHistoryBase>>
  > = ({ signal }) =>
    getCharacterHistoryBase(userId, characterId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled:
      userId !== null &&
      userId !== undefined &&
      characterId !== null &&
      characterId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getCharacterHistoryBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetCharacterHistoryBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCharacterHistoryBase>>
>;
export type GetCharacterHistoryBaseQueryError = unknown;

export function useGetCharacterHistoryBase<
  TData = Awaited<ReturnType<typeof getCharacterHistoryBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharacterHistoryBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCharacterHistoryBase>>,
          TError,
          Awaited<ReturnType<typeof getCharacterHistoryBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCharacterHistoryBase<
  TData = Awaited<ReturnType<typeof getCharacterHistoryBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharacterHistoryBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCharacterHistoryBase>>,
          TError,
          Awaited<ReturnType<typeof getCharacterHistoryBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetCharacterHistoryBase<
  TData = Awaited<ReturnType<typeof getCharacterHistoryBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharacterHistoryBase>>,
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

export function useGetCharacterHistoryBase<
  TData = Awaited<ReturnType<typeof getCharacterHistoryBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getCharacterHistoryBase>>,
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
  const queryOptions = getGetCharacterHistoryBaseQueryOptions(
    userId,
    characterId,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getUpdateCharacterBaseUrl = (
  userId: number,
  characterId: string,
) => {
  return `/users/${userId}/characters/${characterId}`;
};

/**
 * Update character details
 */
export const updateCharacterBase = async (
  userId: number,
  characterId: string,
  options?: RequestInit,
): Promise<GGGCharacter> => {
  return customFetch<GGGCharacter>(
    getUpdateCharacterBaseUrl(userId, characterId),
    {
      ...options,
      method: "PATCH",
    },
  );
};

export const getUpdateCharacterBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateCharacterBase>>,
    TError,
    { userId: number; characterId: string },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateCharacterBase>>,
  TError,
  { userId: number; characterId: string },
  TContext
> => {
  const mutationKey = ["updateCharacterBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateCharacterBase>>,
    { userId: number; characterId: string }
  > = (props) => {
    const { userId, characterId } = props ?? {};

    return updateCharacterBase(userId, characterId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateCharacterBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateCharacterBase>>
>;

export type UpdateCharacterBaseMutationError = unknown;

export const useUpdateCharacterBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateCharacterBase>>,
      TError,
      { userId: number; characterId: string },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateCharacterBase>>,
  TError,
  { userId: number; characterId: string },
  TContext
> => {
  return useMutation(
    getUpdateCharacterBaseMutationOptions(options),
    queryClient,
  );
};
export const getGetPoBsBaseUrl = (userId: number, characterId: string) => {
  return `/users/${userId}/characters/${characterId}/pobs`;
};

/**
 * Get all PoB exports for a character
 */
export const getPoBsBase = async (
  userId: number,
  characterId: string,
  options?: RequestInit,
): Promise<PoB[]> => {
  return customFetch<PoB[]>(getGetPoBsBaseUrl(userId, characterId), {
    ...options,
    method: "GET",
  });
};

export const getGetPoBsBaseQueryKey = (userId: number, characterId: string) => {
  return [`/users/${userId}/characters/${characterId}/pobs`] as const;
};

export const getGetPoBsBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getPoBsBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getPoBsBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetPoBsBaseQueryKey(userId, characterId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPoBsBase>>> = ({
    signal,
  }) => getPoBsBase(userId, characterId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled:
      userId !== null &&
      userId !== undefined &&
      characterId !== null &&
      characterId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getPoBsBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetPoBsBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getPoBsBase>>
>;
export type GetPoBsBaseQueryError = unknown;

export function useGetPoBsBase<
  TData = Awaited<ReturnType<typeof getPoBsBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getPoBsBase>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPoBsBase>>,
          TError,
          Awaited<ReturnType<typeof getPoBsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPoBsBase<
  TData = Awaited<ReturnType<typeof getPoBsBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getPoBsBase>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPoBsBase>>,
          TError,
          Awaited<ReturnType<typeof getPoBsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPoBsBase<
  TData = Awaited<ReturnType<typeof getPoBsBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getPoBsBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetPoBsBase<
  TData = Awaited<ReturnType<typeof getPoBsBase>>,
  TError = unknown,
>(
  userId: number,
  characterId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getPoBsBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetPoBsBaseQueryOptions(userId, characterId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getDeletePoBExportBaseUrl = (
  userId: number,
  characterId: string,
  pobId: number,
) => {
  return `/users/${userId}/characters/${characterId}/pobs/${pobId}`;
};

/**
 * Delete a PoB export for a character
 */
export const deletePoBExportBase = async (
  userId: number,
  characterId: string,
  pobId: number,
  options?: RequestInit,
): Promise<void> => {
  return customFetch<void>(
    getDeletePoBExportBaseUrl(userId, characterId, pobId),
    {
      ...options,
      method: "DELETE",
    },
  );
};

export const getDeletePoBExportBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deletePoBExportBase>>,
    TError,
    { userId: number; characterId: string; pobId: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deletePoBExportBase>>,
  TError,
  { userId: number; characterId: string; pobId: number },
  TContext
> => {
  const mutationKey = ["deletePoBExportBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deletePoBExportBase>>,
    { userId: number; characterId: string; pobId: number }
  > = (props) => {
    const { userId, characterId, pobId } = props ?? {};

    return deletePoBExportBase(userId, characterId, pobId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeletePoBExportBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof deletePoBExportBase>>
>;

export type DeletePoBExportBaseMutationError = unknown;

export const useDeletePoBExportBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deletePoBExportBase>>,
      TError,
      { userId: number; characterId: string; pobId: number },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deletePoBExportBase>>,
  TError,
  { userId: number; characterId: string; pobId: number },
  TContext
> => {
  return useMutation(
    getDeletePoBExportBaseMutationOptions(options),
    queryClient,
  );
};
