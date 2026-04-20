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

import type { CreateSignupBaseBody, ExtendedSignup, Signup } from "../models";

import { customFetch } from "../../fetcher";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * Fetches all signups for the event
 */
export const getGetEventSignupsBaseUrl = (eventId: number) => {
  return `/events/${eventId}/signups`;
};

export const getEventSignupsBase = async (
  eventId: number,
  options?: RequestInit,
): Promise<ExtendedSignup[]> => {
  return customFetch<ExtendedSignup[]>(getGetEventSignupsBaseUrl(eventId), {
    ...options,
    method: "GET",
  });
};

export const getGetEventSignupsBaseQueryKey = (eventId: number) => {
  return [`/events/${eventId}/signups`] as const;
};

export const getGetEventSignupsBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getEventSignupsBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventSignupsBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetEventSignupsBaseQueryKey(eventId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getEventSignupsBase>>
  > = ({ signal }) =>
    getEventSignupsBase(eventId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!eventId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getEventSignupsBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetEventSignupsBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getEventSignupsBase>>
>;
export type GetEventSignupsBaseQueryError = unknown;

export function useGetEventSignupsBase<
  TData = Awaited<ReturnType<typeof getEventSignupsBase>>,
  TError = unknown,
>(
  eventId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventSignupsBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventSignupsBase>>,
          TError,
          Awaited<ReturnType<typeof getEventSignupsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetEventSignupsBase<
  TData = Awaited<ReturnType<typeof getEventSignupsBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventSignupsBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventSignupsBase>>,
          TError,
          Awaited<ReturnType<typeof getEventSignupsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetEventSignupsBase<
  TData = Awaited<ReturnType<typeof getEventSignupsBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventSignupsBase>>,
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

export function useGetEventSignupsBase<
  TData = Awaited<ReturnType<typeof getEventSignupsBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getEventSignupsBase>>,
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
  const queryOptions = getGetEventSignupsBaseQueryOptions(eventId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * Fetches an authenticated user's signup for the event
 */
export const getGetPersonalSignupBaseUrl = (eventId: number) => {
  return `/events/${eventId}/signups/self`;
};

export const getPersonalSignupBase = async (
  eventId: number,
  options?: RequestInit,
): Promise<Signup> => {
  return customFetch<Signup>(getGetPersonalSignupBaseUrl(eventId), {
    ...options,
    method: "GET",
  });
};

export const getGetPersonalSignupBaseQueryKey = (eventId: number) => {
  return [`/events/${eventId}/signups/self`] as const;
};

export const getGetPersonalSignupBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getPersonalSignupBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPersonalSignupBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetPersonalSignupBaseQueryKey(eventId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getPersonalSignupBase>>
  > = ({ signal }) =>
    getPersonalSignupBase(eventId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!eventId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getPersonalSignupBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetPersonalSignupBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getPersonalSignupBase>>
>;
export type GetPersonalSignupBaseQueryError = unknown;

export function useGetPersonalSignupBase<
  TData = Awaited<ReturnType<typeof getPersonalSignupBase>>,
  TError = unknown,
>(
  eventId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPersonalSignupBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPersonalSignupBase>>,
          TError,
          Awaited<ReturnType<typeof getPersonalSignupBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPersonalSignupBase<
  TData = Awaited<ReturnType<typeof getPersonalSignupBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPersonalSignupBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPersonalSignupBase>>,
          TError,
          Awaited<ReturnType<typeof getPersonalSignupBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPersonalSignupBase<
  TData = Awaited<ReturnType<typeof getPersonalSignupBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPersonalSignupBase>>,
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

export function useGetPersonalSignupBase<
  TData = Awaited<ReturnType<typeof getPersonalSignupBase>>,
  TError = unknown,
>(
  eventId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPersonalSignupBase>>,
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
  const queryOptions = getGetPersonalSignupBaseQueryOptions(eventId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}

/**
 * Creates a signup for the authenticated user
 */
export const getCreateSignupBaseUrl = (eventId: number) => {
  return `/events/${eventId}/signups/self`;
};

export const createSignupBase = async (
  eventId: number,
  createSignupBaseBody: CreateSignupBaseBody,
  options?: RequestInit,
): Promise<Signup> => {
  return customFetch<Signup>(getCreateSignupBaseUrl(eventId), {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createSignupBaseBody),
  });
};

export const getCreateSignupBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createSignupBase>>,
    TError,
    { eventId: number; data: CreateSignupBaseBody },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createSignupBase>>,
  TError,
  { eventId: number; data: CreateSignupBaseBody },
  TContext
> => {
  const mutationKey = ["createSignupBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createSignupBase>>,
    { eventId: number; data: CreateSignupBaseBody }
  > = (props) => {
    const { eventId, data } = props ?? {};

    return createSignupBase(eventId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateSignupBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof createSignupBase>>
>;
export type CreateSignupBaseMutationBody = CreateSignupBaseBody;
export type CreateSignupBaseMutationError = unknown;

export const useCreateSignupBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createSignupBase>>,
      TError,
      { eventId: number; data: CreateSignupBaseBody },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createSignupBase>>,
  TError,
  { eventId: number; data: CreateSignupBaseBody },
  TContext
> => {
  return useMutation(getCreateSignupBaseMutationOptions(options), queryClient);
};
/**
 * Deletes a user's signup for the event
 */
export const getDeleteSignupBaseUrl = (eventId: number, userId: number) => {
  return `/events/${eventId}/signups/${userId}`;
};

export const deleteSignupBase = async (
  eventId: number,
  userId: number,
  options?: RequestInit,
): Promise<void> => {
  return customFetch<void>(getDeleteSignupBaseUrl(eventId, userId), {
    ...options,
    method: "DELETE",
  });
};

export const getDeleteSignupBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteSignupBase>>,
    TError,
    { eventId: number; userId: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteSignupBase>>,
  TError,
  { eventId: number; userId: number },
  TContext
> => {
  const mutationKey = ["deleteSignupBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteSignupBase>>,
    { eventId: number; userId: number }
  > = (props) => {
    const { eventId, userId } = props ?? {};

    return deleteSignupBase(eventId, userId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteSignupBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteSignupBase>>
>;

export type DeleteSignupBaseMutationError = unknown;

export const useDeleteSignupBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteSignupBase>>,
      TError,
      { eventId: number; userId: number },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteSignupBase>>,
  TError,
  { eventId: number; userId: number },
  TContext
> => {
  return useMutation(getDeleteSignupBaseMutationOptions(options), queryClient);
};
