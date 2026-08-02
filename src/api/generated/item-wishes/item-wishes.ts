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
  ChangeItemWishBaseBody,
  CreateItemWishBaseBody,
  ItemWish,
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

export const getGetItemWishesForTeamBaseUrl = (
  eventId: number,
  teamId: number,
) => {
  return `/events/${eventId}/teams/${teamId}/item_wishes`;
};

/**
 * Get item wishes for a team in an event
 */
export const getItemWishesForTeamBase = async (
  eventId: number,
  teamId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<ItemWish[]> => {
  return customFetch<ItemWish[]>(
    getGetItemWishesForTeamBaseUrl(eventId, teamId),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetItemWishesForTeamBaseQueryKey = (
  eventId: number,
  teamId: number,
) => {
  return [`/events/${eventId}/teams/${teamId}/item_wishes`] as const;
};

export const getGetItemWishesForTeamBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
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
    getGetItemWishesForTeamBaseQueryKey(eventId, teamId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getItemWishesForTeamBase>>
  > = ({ signal }) =>
    getItemWishesForTeamBase(eventId, teamId, { signal, ...requestOptions });

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
    Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetItemWishesForTeamBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getItemWishesForTeamBase>>
>;
export type GetItemWishesForTeamBaseQueryError = unknown;

export function useGetItemWishesForTeamBase<
  TData = Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
          TError,
          Awaited<ReturnType<typeof getItemWishesForTeamBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetItemWishesForTeamBase<
  TData = Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
          TError,
          Awaited<ReturnType<typeof getItemWishesForTeamBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetItemWishesForTeamBase<
  TData = Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
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

export function useGetItemWishesForTeamBase<
  TData = Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
  TError = unknown,
>(
  eventId: number,
  teamId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getItemWishesForTeamBase>>,
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
  const queryOptions = getGetItemWishesForTeamBaseQueryOptions(
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

export const getCreateItemWishBaseUrl = (eventId: number, teamId: number) => {
  return `/events/${eventId}/teams/${teamId}/item_wishes`;
};

/**
 * Create an item wish for a user in a team
 */
export const createItemWishBase = async (
  eventId: number,
  teamId: number,
  createItemWishBaseBody: CreateItemWishBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<ItemWish> => {
  return customFetch<ItemWish>(getCreateItemWishBaseUrl(eventId, teamId), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createItemWishBaseBody),
  });
};

export const getCreateItemWishBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createItemWishBase>>,
    TError,
    { eventId: number; teamId: number; data: CreateItemWishBaseBody },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createItemWishBase>>,
  TError,
  { eventId: number; teamId: number; data: CreateItemWishBaseBody },
  TContext
> => {
  const mutationKey = ["createItemWishBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createItemWishBase>>,
    { eventId: number; teamId: number; data: CreateItemWishBaseBody }
  > = (props) => {
    const { eventId, teamId, data } = props ?? {};

    return createItemWishBase(eventId, teamId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateItemWishBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof createItemWishBase>>
>;
export type CreateItemWishBaseMutationBody = CreateItemWishBaseBody;
export type CreateItemWishBaseMutationError = unknown;

export const useCreateItemWishBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createItemWishBase>>,
      TError,
      { eventId: number; teamId: number; data: CreateItemWishBaseBody },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createItemWishBase>>,
  TError,
  { eventId: number; teamId: number; data: CreateItemWishBaseBody },
  TContext
> => {
  return useMutation(
    getCreateItemWishBaseMutationOptions(options),
    queryClient,
  );
};
export const getDeleteItemWishBaseUrl = (
  eventId: number,
  teamId: number,
  wishId: number,
) => {
  return `/events/${eventId}/teams/${teamId}/item_wishes/${wishId}`;
};

/**
 * Delete an item wish for a user in a team
 */
export const deleteItemWishBase = async (
  eventId: number,
  teamId: number,
  wishId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
  return customFetch<void>(getDeleteItemWishBaseUrl(eventId, teamId, wishId), {
    ...options,
    method: "DELETE",
  });
};

export const getDeleteItemWishBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteItemWishBase>>,
    TError,
    { eventId: number; teamId: number; wishId: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteItemWishBase>>,
  TError,
  { eventId: number; teamId: number; wishId: number },
  TContext
> => {
  const mutationKey = ["deleteItemWishBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteItemWishBase>>,
    { eventId: number; teamId: number; wishId: number }
  > = (props) => {
    const { eventId, teamId, wishId } = props ?? {};

    return deleteItemWishBase(eventId, teamId, wishId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteItemWishBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteItemWishBase>>
>;

export type DeleteItemWishBaseMutationError = unknown;

export const useDeleteItemWishBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteItemWishBase>>,
      TError,
      { eventId: number; teamId: number; wishId: number },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteItemWishBase>>,
  TError,
  { eventId: number; teamId: number; wishId: number },
  TContext
> => {
  return useMutation(
    getDeleteItemWishBaseMutationOptions(options),
    queryClient,
  );
};
export const getChangeItemWishBaseUrl = (
  eventId: number,
  teamId: number,
  wishId: number,
) => {
  return `/events/${eventId}/teams/${teamId}/item_wishes/${wishId}`;
};

/**
 * Change an item wish for a user in a team
 */
export const changeItemWishBase = async (
  eventId: number,
  teamId: number,
  wishId: number,
  changeItemWishBaseBody: ChangeItemWishBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<ItemWish> => {
  return customFetch<ItemWish>(
    getChangeItemWishBaseUrl(eventId, teamId, wishId),
    {
      ...options,
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(changeItemWishBaseBody),
    },
  );
};

export const getChangeItemWishBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof changeItemWishBase>>,
    TError,
    {
      eventId: number;
      teamId: number;
      wishId: number;
      data: ChangeItemWishBaseBody;
    },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof changeItemWishBase>>,
  TError,
  {
    eventId: number;
    teamId: number;
    wishId: number;
    data: ChangeItemWishBaseBody;
  },
  TContext
> => {
  const mutationKey = ["changeItemWishBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof changeItemWishBase>>,
    {
      eventId: number;
      teamId: number;
      wishId: number;
      data: ChangeItemWishBaseBody;
    }
  > = (props) => {
    const { eventId, teamId, wishId, data } = props ?? {};

    return changeItemWishBase(eventId, teamId, wishId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type ChangeItemWishBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof changeItemWishBase>>
>;
export type ChangeItemWishBaseMutationBody = ChangeItemWishBaseBody;
export type ChangeItemWishBaseMutationError = unknown;

export const useChangeItemWishBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof changeItemWishBase>>,
      TError,
      {
        eventId: number;
        teamId: number;
        wishId: number;
        data: ChangeItemWishBaseBody;
      },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof changeItemWishBase>>,
  TError,
  {
    eventId: number;
    teamId: number;
    wishId: number;
    data: ChangeItemWishBaseBody;
  },
  TContext
> => {
  return useMutation(
    getChangeItemWishBaseMutationOptions(options),
    queryClient,
  );
};
