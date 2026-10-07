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
  CreateSignupBaseBody,
  ExtendedSignup,
  JoinSignupGroupBaseBody,
  Signup,
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

export const getGetEventSignupsBaseUrl = (eventId: number) => {
  return `/events/${eventId}/signups`;
};

/**
 * Fetches all signups for the event
 */
export const getEventSignupsBase = async (
  eventId: number,
  options?: Parameters<typeof customFetch>[1],
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
    enabled: eventId !== null && eventId !== undefined,
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

  return withQueryKey(query, queryOptions.queryKey);
}

export const getGetPersonalSignupBaseUrl = (eventId: number) => {
  return `/events/${eventId}/signups/self`;
};

/**
 * Fetches an authenticated user's signup for the event
 */
export const getPersonalSignupBase = async (
  eventId: number,
  options?: Parameters<typeof customFetch>[1],
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
    enabled: eventId !== null && eventId !== undefined,
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

  return withQueryKey(query, queryOptions.queryKey);
}

export const getCreateSignupBaseUrl = (eventId: number) => {
  return `/events/${eventId}/signups/self`;
};

/**
 * Creates a signup for the authenticated user
 */
export const createSignupBase = async (
  eventId: number,
  createSignupBaseBody: CreateSignupBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<Signup> => {
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
  return customFetch<Signup>(getCreateSignupBaseUrl(eventId), {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(options?.headers),
    },
    body: JSON.stringify(createSignupBaseBody),
  });
};

export const getCreateSignupBaseMutationKey = () =>
  ["createSignupBase"] as const;

export const getCreateSignupBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createSignupBase>>,
    TError,
    CreateSignupBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createSignupBase>>,
  TError,
  CreateSignupBaseMutationVariables,
  TContext
> => {
  const mutationKey = getCreateSignupBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createSignupBase>>,
    CreateSignupBaseMutationVariables
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
export type CreateSignupBaseMutationVariables = {
  eventId: number;
  data: CreateSignupBaseBody;
};

export const useCreateSignupBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createSignupBase>>,
      TError,
      CreateSignupBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createSignupBase>>,
  TError,
  CreateSignupBaseMutationVariables,
  TContext
> => {
  return useMutation(getCreateSignupBaseMutationOptions(options), queryClient);
};
export const getLeaveSignupGroupBaseUrl = (eventId: number) => {
  return `/events/${eventId}/signups/self/group`;
};

/**
 * Removes the authenticated user from their group
 */
export const leaveSignupGroupBase = async (
  eventId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<Signup> => {
  return customFetch<Signup>(getLeaveSignupGroupBaseUrl(eventId), {
    ...options,
    method: "DELETE",
  });
};

export const getLeaveSignupGroupBaseMutationKey = () =>
  ["leaveSignupGroupBase"] as const;

export const getLeaveSignupGroupBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof leaveSignupGroupBase>>,
    TError,
    LeaveSignupGroupBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof leaveSignupGroupBase>>,
  TError,
  LeaveSignupGroupBaseMutationVariables,
  TContext
> => {
  const mutationKey = getLeaveSignupGroupBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof leaveSignupGroupBase>>,
    LeaveSignupGroupBaseMutationVariables
  > = (props) => {
    const { eventId } = props ?? {};

    return leaveSignupGroupBase(eventId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type LeaveSignupGroupBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof leaveSignupGroupBase>>
>;

export type LeaveSignupGroupBaseMutationError = unknown;
export type LeaveSignupGroupBaseMutationVariables = { eventId: number };

export const useLeaveSignupGroupBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof leaveSignupGroupBase>>,
      TError,
      LeaveSignupGroupBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof leaveSignupGroupBase>>,
  TError,
  LeaveSignupGroupBaseMutationVariables,
  TContext
> => {
  return useMutation(
    getLeaveSignupGroupBaseMutationOptions(options),
    queryClient,
  );
};
export const getCreateSignupGroupBaseUrl = (eventId: number) => {
  return `/events/${eventId}/signups/self/group`;
};

/**
 * Creates a new group containing the authenticated user and returns the signup
 */
export const createSignupGroupBase = async (
  eventId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<Signup> => {
  return customFetch<Signup>(getCreateSignupGroupBaseUrl(eventId), {
    ...options,
    method: "POST",
  });
};

export const getCreateSignupGroupBaseMutationKey = () =>
  ["createSignupGroupBase"] as const;

export const getCreateSignupGroupBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createSignupGroupBase>>,
    TError,
    CreateSignupGroupBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createSignupGroupBase>>,
  TError,
  CreateSignupGroupBaseMutationVariables,
  TContext
> => {
  const mutationKey = getCreateSignupGroupBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createSignupGroupBase>>,
    CreateSignupGroupBaseMutationVariables
  > = (props) => {
    const { eventId } = props ?? {};

    return createSignupGroupBase(eventId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateSignupGroupBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof createSignupGroupBase>>
>;

export type CreateSignupGroupBaseMutationError = unknown;
export type CreateSignupGroupBaseMutationVariables = { eventId: number };

export const useCreateSignupGroupBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createSignupGroupBase>>,
      TError,
      CreateSignupGroupBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createSignupGroupBase>>,
  TError,
  CreateSignupGroupBaseMutationVariables,
  TContext
> => {
  return useMutation(
    getCreateSignupGroupBaseMutationOptions(options),
    queryClient,
  );
};
export const getJoinSignupGroupBaseUrl = (eventId: number) => {
  return `/events/${eventId}/signups/self/group/join`;
};

/**
 * Joins the group with the given key and returns the signup
 */
export const joinSignupGroupBase = async (
  eventId: number,
  joinSignupGroupBaseBody: JoinSignupGroupBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<Signup> => {
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
  return customFetch<Signup>(getJoinSignupGroupBaseUrl(eventId), {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(options?.headers),
    },
    body: JSON.stringify(joinSignupGroupBaseBody),
  });
};

export const getJoinSignupGroupBaseMutationKey = () =>
  ["joinSignupGroupBase"] as const;

export const getJoinSignupGroupBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof joinSignupGroupBase>>,
    TError,
    JoinSignupGroupBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof joinSignupGroupBase>>,
  TError,
  JoinSignupGroupBaseMutationVariables,
  TContext
> => {
  const mutationKey = getJoinSignupGroupBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof joinSignupGroupBase>>,
    JoinSignupGroupBaseMutationVariables
  > = (props) => {
    const { eventId, data } = props ?? {};

    return joinSignupGroupBase(eventId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type JoinSignupGroupBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof joinSignupGroupBase>>
>;
export type JoinSignupGroupBaseMutationBody = JoinSignupGroupBaseBody;
export type JoinSignupGroupBaseMutationError = unknown;
export type JoinSignupGroupBaseMutationVariables = {
  eventId: number;
  data: JoinSignupGroupBaseBody;
};

export const useJoinSignupGroupBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof joinSignupGroupBase>>,
      TError,
      JoinSignupGroupBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof joinSignupGroupBase>>,
  TError,
  JoinSignupGroupBaseMutationVariables,
  TContext
> => {
  return useMutation(
    getJoinSignupGroupBaseMutationOptions(options),
    queryClient,
  );
};
export const getDeleteSignupBaseUrl = (eventId: number, userId: number) => {
  return `/events/${eventId}/signups/${userId}`;
};

/**
 * Deletes a user's signup for the event
 */
export const deleteSignupBase = async (
  eventId: number,
  userId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
  return customFetch<void>(getDeleteSignupBaseUrl(eventId, userId), {
    ...options,
    method: "DELETE",
  });
};

export const getDeleteSignupBaseMutationKey = () =>
  ["deleteSignupBase"] as const;

export const getDeleteSignupBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteSignupBase>>,
    TError,
    DeleteSignupBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteSignupBase>>,
  TError,
  DeleteSignupBaseMutationVariables,
  TContext
> => {
  const mutationKey = getDeleteSignupBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteSignupBase>>,
    DeleteSignupBaseMutationVariables
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
export type DeleteSignupBaseMutationVariables = {
  eventId: number;
  userId: number;
};

export const useDeleteSignupBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteSignupBase>>,
      TError,
      DeleteSignupBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteSignupBase>>,
  TError,
  DeleteSignupBaseMutationVariables,
  TContext
> => {
  return useMutation(getDeleteSignupBaseMutationOptions(options), queryClient);
};
