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
  CreateScoringRuleBaseBody,
  DeleteScoringRuleBase200,
  ScoringRule,
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

export const getGetScoringRulesForEventBaseUrl = (eventId: number) => {
  return `/events/${eventId}/scoring-rules`;
};

/**
 * Fetches the scoring rules for the current event
 */
export const getScoringRulesForEventBase = async (
  eventId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<ScoringRule[]> => {
  return customFetch<ScoringRule[]>(
    getGetScoringRulesForEventBaseUrl(eventId),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetScoringRulesForEventBaseQueryKey = (eventId: number) => {
  return [`/events/${eventId}/scoring-rules`] as const;
};

export const getGetScoringRulesForEventBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetScoringRulesForEventBaseQueryKey(eventId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getScoringRulesForEventBase>>
  > = ({ signal }) =>
    getScoringRulesForEventBase(eventId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: eventId !== null && eventId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetScoringRulesForEventBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getScoringRulesForEventBase>>
>;
export type GetScoringRulesForEventBaseQueryError = unknown;

export function useGetScoringRulesForEventBase<
  TData = Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
          TError,
          Awaited<ReturnType<typeof getScoringRulesForEventBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetScoringRulesForEventBase<
  TData = Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
          TError,
          Awaited<ReturnType<typeof getScoringRulesForEventBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetScoringRulesForEventBase<
  TData = Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
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

export function useGetScoringRulesForEventBase<
  TData = Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getScoringRulesForEventBase>>,
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
  const queryOptions = getGetScoringRulesForEventBaseQueryOptions(
    eventId,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getCreateScoringRuleBaseUrl = (eventId: number) => {
  return `/events/${eventId}/scoring-rules`;
};

/**
 * Creates a new scoring rule
 */
export const createScoringRuleBase = async (
  eventId: number,
  createScoringRuleBaseBody: CreateScoringRuleBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<ScoringRule> => {
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
  return customFetch<ScoringRule>(getCreateScoringRuleBaseUrl(eventId), {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(options?.headers),
    },
    body: JSON.stringify(createScoringRuleBaseBody),
  });
};

export const getCreateScoringRuleBaseMutationKey = () =>
  ["createScoringRuleBase"] as const;

export const getCreateScoringRuleBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createScoringRuleBase>>,
    TError,
    CreateScoringRuleBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createScoringRuleBase>>,
  TError,
  CreateScoringRuleBaseMutationVariables,
  TContext
> => {
  const mutationKey = getCreateScoringRuleBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createScoringRuleBase>>,
    CreateScoringRuleBaseMutationVariables
  > = (props) => {
    const { eventId, data } = props ?? {};

    return createScoringRuleBase(eventId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateScoringRuleBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof createScoringRuleBase>>
>;
export type CreateScoringRuleBaseMutationBody = CreateScoringRuleBaseBody;
export type CreateScoringRuleBaseMutationError = unknown;
export type CreateScoringRuleBaseMutationVariables = {
  eventId: number;
  data: CreateScoringRuleBaseBody;
};

export const useCreateScoringRuleBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createScoringRuleBase>>,
      TError,
      CreateScoringRuleBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createScoringRuleBase>>,
  TError,
  CreateScoringRuleBaseMutationVariables,
  TContext
> => {
  return useMutation(
    getCreateScoringRuleBaseMutationOptions(options),
    queryClient,
  );
};
export const getDeleteScoringRuleBaseUrl = (eventId: number, id: number) => {
  return `/events/${eventId}/scoring-rules/${id}`;
};

/**
 * Deletes a scoring rule by id
 */
export const deleteScoringRuleBase = async (
  eventId: number,
  id: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<DeleteScoringRuleBase200> => {
  return customFetch<DeleteScoringRuleBase200>(
    getDeleteScoringRuleBaseUrl(eventId, id),
    {
      ...options,
      method: "DELETE",
    },
  );
};

export const getDeleteScoringRuleBaseMutationKey = () =>
  ["deleteScoringRuleBase"] as const;

export const getDeleteScoringRuleBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteScoringRuleBase>>,
    TError,
    DeleteScoringRuleBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteScoringRuleBase>>,
  TError,
  DeleteScoringRuleBaseMutationVariables,
  TContext
> => {
  const mutationKey = getDeleteScoringRuleBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteScoringRuleBase>>,
    DeleteScoringRuleBaseMutationVariables
  > = (props) => {
    const { eventId, id } = props ?? {};

    return deleteScoringRuleBase(eventId, id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteScoringRuleBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteScoringRuleBase>>
>;

export type DeleteScoringRuleBaseMutationError = unknown;
export type DeleteScoringRuleBaseMutationVariables = {
  eventId: number;
  id: number;
};

export const useDeleteScoringRuleBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteScoringRuleBase>>,
      TError,
      DeleteScoringRuleBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteScoringRuleBase>>,
  TError,
  DeleteScoringRuleBaseMutationVariables,
  TContext
> => {
  return useMutation(
    getDeleteScoringRuleBaseMutationOptions(options),
    queryClient,
  );
};
