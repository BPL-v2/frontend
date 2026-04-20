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

import type {
  GetEventActivitiesBase200,
  GetEventActivitiesBaseParams,
  GetEventActivitiesForUserBaseParams,
} from "../models";

import { customFetch } from "../../fetcher";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * Get calculated active times for all users in an event
 */
export const getGetEventActivitiesBaseUrl = (
  eventId: number,
  params?: GetEventActivitiesBaseParams,
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0
    ? `/events/${eventId}/activity?${stringifiedParams}`
    : `/events/${eventId}/activity`;
};

export const getEventActivitiesBase = async (
  eventId: number,
  params?: GetEventActivitiesBaseParams,
  options?: RequestInit,
): Promise<GetEventActivitiesBase200> => {
  return customFetch<GetEventActivitiesBase200>(
    getGetEventActivitiesBaseUrl(eventId, params),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetEventActivitiesBaseQueryKey = (
  eventId: number,
  params?: GetEventActivitiesBaseParams,
) => {
  return [`/events/${eventId}/activity`, ...(params ? [params] : [])] as const;
};

export const getGetEventActivitiesBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getEventActivitiesBase>>,
  TError = unknown,
>(
  eventId: number,
  params?: GetEventActivitiesBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesBase>>,
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
    getGetEventActivitiesBaseQueryKey(eventId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getEventActivitiesBase>>
  > = ({ signal }) =>
    getEventActivitiesBase(eventId, params, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!eventId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getEventActivitiesBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetEventActivitiesBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getEventActivitiesBase>>
>;
export type GetEventActivitiesBaseQueryError = unknown;

export function useGetEventActivitiesBase<
  TData = Awaited<ReturnType<typeof getEventActivitiesBase>>,
  TError = unknown,
>(
  eventId: number,
  params: undefined | GetEventActivitiesBaseParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventActivitiesBase>>,
          TError,
          Awaited<ReturnType<typeof getEventActivitiesBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetEventActivitiesBase<
  TData = Awaited<ReturnType<typeof getEventActivitiesBase>>,
  TError = unknown,
>(
  eventId: number,
  params?: GetEventActivitiesBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventActivitiesBase>>,
          TError,
          Awaited<ReturnType<typeof getEventActivitiesBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetEventActivitiesBase<
  TData = Awaited<ReturnType<typeof getEventActivitiesBase>>,
  TError = unknown,
>(
  eventId: number,
  params?: GetEventActivitiesBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesBase>>,
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

export function useGetEventActivitiesBase<
  TData = Awaited<ReturnType<typeof getEventActivitiesBase>>,
  TError = unknown,
>(
  eventId: number,
  params?: GetEventActivitiesBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesBase>>,
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
  const queryOptions = getGetEventActivitiesBaseQueryOptions(
    eventId,
    params,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * Get calculated active times for a user in an event
 */
export const getGetEventActivitiesForUserBaseUrl = (
  eventId: number,
  userId: number,
  params?: GetEventActivitiesForUserBaseParams,
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0
    ? `/events/${eventId}/activity/${userId}?${stringifiedParams}`
    : `/events/${eventId}/activity/${userId}`;
};

export const getEventActivitiesForUserBase = async (
  eventId: number,
  userId: number,
  params?: GetEventActivitiesForUserBaseParams,
  options?: RequestInit,
): Promise<number> => {
  return customFetch<number>(
    getGetEventActivitiesForUserBaseUrl(eventId, userId, params),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetEventActivitiesForUserBaseQueryKey = (
  eventId: number,
  userId: number,
  params?: GetEventActivitiesForUserBaseParams,
) => {
  return [
    `/events/${eventId}/activity/${userId}`,
    ...(params ? [params] : []),
  ] as const;
};

export const getGetEventActivitiesForUserBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
  TError = unknown,
>(
  eventId: number,
  userId: number,
  params?: GetEventActivitiesForUserBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
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
    getGetEventActivitiesForUserBaseQueryKey(eventId, userId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getEventActivitiesForUserBase>>
  > = ({ signal }) =>
    getEventActivitiesForUserBase(eventId, userId, params, {
      signal,
      ...requestOptions,
    });

  return {
    queryKey,
    queryFn,
    enabled: !!(eventId && userId),
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetEventActivitiesForUserBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getEventActivitiesForUserBase>>
>;
export type GetEventActivitiesForUserBaseQueryError = unknown;

export function useGetEventActivitiesForUserBase<
  TData = Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
  TError = unknown,
>(
  eventId: number,
  userId: number,
  params: undefined | GetEventActivitiesForUserBaseParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
          TError,
          Awaited<ReturnType<typeof getEventActivitiesForUserBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetEventActivitiesForUserBase<
  TData = Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
  TError = unknown,
>(
  eventId: number,
  userId: number,
  params?: GetEventActivitiesForUserBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
          TError,
          Awaited<ReturnType<typeof getEventActivitiesForUserBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetEventActivitiesForUserBase<
  TData = Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
  TError = unknown,
>(
  eventId: number,
  userId: number,
  params?: GetEventActivitiesForUserBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
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

export function useGetEventActivitiesForUserBase<
  TData = Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
  TError = unknown,
>(
  eventId: number,
  userId: number,
  params?: GetEventActivitiesForUserBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventActivitiesForUserBase>>,
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
  const queryOptions = getGetEventActivitiesForUserBaseQueryOptions(
    eventId,
    userId,
    params,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}
