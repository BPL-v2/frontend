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

import { customFetch } from "../../fetcher";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * Fetches the scoring rules for the current event
 */
export const getGetScoringRulesForEventBaseUrl = (eventId: number) => {
  return `/events/${eventId}/scoring-rules`;
};

export const getScoringRulesForEventBase = async (
  eventId: number,
  options?: RequestInit,
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
    enabled: !!eventId,
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

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * Creates a new scoring rule
 */
export const getCreateScoringRuleBaseUrl = (eventId: number) => {
  return `/events/${eventId}/scoring-rules`;
};

export const createScoringRuleBase = async (
  eventId: number,
  createScoringRuleBaseBody: CreateScoringRuleBaseBody,
  options?: RequestInit,
): Promise<ScoringRule> => {
  return customFetch<ScoringRule>(getCreateScoringRuleBaseUrl(eventId), {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createScoringRuleBaseBody),
  });
};

export const getCreateScoringRuleBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createScoringRuleBase>>,
    TError,
    { eventId: number; data: CreateScoringRuleBaseBody },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createScoringRuleBase>>,
  TError,
  { eventId: number; data: CreateScoringRuleBaseBody },
  TContext
> => {
  const mutationKey = ["createScoringRuleBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createScoringRuleBase>>,
    { eventId: number; data: CreateScoringRuleBaseBody }
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

export const useCreateScoringRuleBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createScoringRuleBase>>,
      TError,
      { eventId: number; data: CreateScoringRuleBaseBody },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createScoringRuleBase>>,
  TError,
  { eventId: number; data: CreateScoringRuleBaseBody },
  TContext
> => {
  return useMutation(
    getCreateScoringRuleBaseMutationOptions(options),
    queryClient,
  );
};
/**
 * Deletes a scoring rule by id
 */
export const getDeleteScoringRuleBaseUrl = (eventId: number, id: number) => {
  return `/events/${eventId}/scoring-rules/${id}`;
};

export const deleteScoringRuleBase = async (
  eventId: number,
  id: number,
  options?: RequestInit,
): Promise<DeleteScoringRuleBase200> => {
  return customFetch<DeleteScoringRuleBase200>(
    getDeleteScoringRuleBaseUrl(eventId, id),
    {
      ...options,
      method: "DELETE",
    },
  );
};

export const getDeleteScoringRuleBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteScoringRuleBase>>,
    TError,
    { eventId: number; id: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteScoringRuleBase>>,
  TError,
  { eventId: number; id: number },
  TContext
> => {
  const mutationKey = ["deleteScoringRuleBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteScoringRuleBase>>,
    { eventId: number; id: number }
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

export const useDeleteScoringRuleBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteScoringRuleBase>>,
      TError,
      { eventId: number; id: number },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteScoringRuleBase>>,
  TError,
  { eventId: number; id: number },
  TContext
> => {
  return useMutation(
    getDeleteScoringRuleBaseMutationOptions(options),
    queryClient,
  );
};
