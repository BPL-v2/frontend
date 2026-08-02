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

import type { GetLadderBaseParams, LadderEntry } from "../models";

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

export const getGetLadderBaseUrl = (
  eventId: number,
  params?: GetLadderBaseParams,
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : String(value));
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0
    ? `/events/${eventId}/ladder?${stringifiedParams}`
    : `/events/${eventId}/ladder`;
};

/**
 * Get the ladder for an event
 */
export const getLadderBase = async (
  eventId: number,
  params?: GetLadderBaseParams,
  options?: Parameters<typeof customFetch>[1],
): Promise<LadderEntry[]> => {
  return customFetch<LadderEntry[]>(getGetLadderBaseUrl(eventId, params), {
    ...options,
    method: "GET",
  });
};

export const getGetLadderBaseQueryKey = (
  eventId: number,
  params?: GetLadderBaseParams,
) => {
  return [`/events/${eventId}/ladder`, ...(params ? [params] : [])] as const;
};

export const getGetLadderBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getLadderBase>>,
  TError = unknown,
>(
  eventId: number,
  params?: GetLadderBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getLadderBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetLadderBaseQueryKey(eventId, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getLadderBase>>> = ({
    signal,
  }) => getLadderBase(eventId, params, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: eventId !== null && eventId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getLadderBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetLadderBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getLadderBase>>
>;
export type GetLadderBaseQueryError = unknown;

export function useGetLadderBase<
  TData = Awaited<ReturnType<typeof getLadderBase>>,
  TError = unknown,
>(
  eventId: number,
  params: undefined | GetLadderBaseParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getLadderBase>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getLadderBase>>,
          TError,
          Awaited<ReturnType<typeof getLadderBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetLadderBase<
  TData = Awaited<ReturnType<typeof getLadderBase>>,
  TError = unknown,
>(
  eventId: number,
  params?: GetLadderBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getLadderBase>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getLadderBase>>,
          TError,
          Awaited<ReturnType<typeof getLadderBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetLadderBase<
  TData = Awaited<ReturnType<typeof getLadderBase>>,
  TError = unknown,
>(
  eventId: number,
  params?: GetLadderBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getLadderBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetLadderBase<
  TData = Awaited<ReturnType<typeof getLadderBase>>,
  TError = unknown,
>(
  eventId: number,
  params?: GetLadderBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getLadderBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetLadderBaseQueryOptions(eventId, params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}
