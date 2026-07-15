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

import type { RecurringJob, StartJobBaseBody } from "../models";

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

export const getGetJobsBaseUrl = () => {
  return `/jobs`;
};

/**
 * Get all recurring jobs
 */
export const getJobsBase = async (
  options?: RequestInit,
): Promise<RecurringJob[]> => {
  return customFetch<RecurringJob[]>(getGetJobsBaseUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetJobsBaseQueryKey = () => {
  return [`/jobs`] as const;
};

export const getGetJobsBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getJobsBase>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getJobsBase>>, TError, TData>
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetJobsBaseQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getJobsBase>>> = ({
    signal,
  }) => getJobsBase({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getJobsBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetJobsBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getJobsBase>>
>;
export type GetJobsBaseQueryError = unknown;

export function useGetJobsBase<
  TData = Awaited<ReturnType<typeof getJobsBase>>,
  TError = unknown,
>(
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getJobsBase>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getJobsBase>>,
          TError,
          Awaited<ReturnType<typeof getJobsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetJobsBase<
  TData = Awaited<ReturnType<typeof getJobsBase>>,
  TError = unknown,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getJobsBase>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getJobsBase>>,
          TError,
          Awaited<ReturnType<typeof getJobsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetJobsBase<
  TData = Awaited<ReturnType<typeof getJobsBase>>,
  TError = unknown,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getJobsBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetJobsBase<
  TData = Awaited<ReturnType<typeof getJobsBase>>,
  TError = unknown,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getJobsBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetJobsBaseQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getStartJobBaseUrl = () => {
  return `/jobs`;
};

/**
 * Start a recurring job
 */
export const startJobBase = async (
  startJobBaseBody: StartJobBaseBody,
  options?: RequestInit,
): Promise<RecurringJob> => {
  return customFetch<RecurringJob>(getStartJobBaseUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(startJobBaseBody),
  });
};

export const getStartJobBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof startJobBase>>,
    TError,
    { data: StartJobBaseBody },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof startJobBase>>,
  TError,
  { data: StartJobBaseBody },
  TContext
> => {
  const mutationKey = ["startJobBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof startJobBase>>,
    { data: StartJobBaseBody }
  > = (props) => {
    const { data } = props ?? {};

    return startJobBase(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type StartJobBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof startJobBase>>
>;
export type StartJobBaseMutationBody = StartJobBaseBody;
export type StartJobBaseMutationError = unknown;

export const useStartJobBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof startJobBase>>,
      TError,
      { data: StartJobBaseBody },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof startJobBase>>,
  TError,
  { data: StartJobBaseBody },
  TContext
> => {
  return useMutation(getStartJobBaseMutationOptions(options), queryClient);
};
