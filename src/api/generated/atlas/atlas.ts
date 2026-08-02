import { useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type { Atlas } from "../models";

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

export const getGetTeamAtlasesForEventBaseUrl = (
  eventId: number,
  teamId: number,
) => {
  return `/events/${eventId}/team/${teamId}/atlas`;
};

/**
 * Get atlas trees for your team for an event
 */
export const getTeamAtlasesForEventBase = async (
  eventId: number,
  teamId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<Atlas[]> => {
  return customFetch<Atlas[]>(
    getGetTeamAtlasesForEventBaseUrl(eventId, teamId),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetTeamAtlasesForEventBaseQueryKey = (
  eventId: number,
  teamId: number,
) => {
  return [`/events/${eventId}/team/${teamId}/atlas`] as const;
};

export const getGetTeamAtlasesForEventBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
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
    getGetTeamAtlasesForEventBaseQueryKey(eventId, teamId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>
  > = ({ signal }) =>
    getTeamAtlasesForEventBase(eventId, teamId, { signal, ...requestOptions });

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
    Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetTeamAtlasesForEventBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>
>;
export type GetTeamAtlasesForEventBaseQueryError = unknown;

export function useGetTeamAtlasesForEventBase<
  TData = Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamAtlasesForEventBase<
  TData = Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetTeamAtlasesForEventBase<
  TData = Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
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

export function useGetTeamAtlasesForEventBase<
  TData = Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getTeamAtlasesForEventBase>>,
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
  const queryOptions = getGetTeamAtlasesForEventBaseQueryOptions(
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
