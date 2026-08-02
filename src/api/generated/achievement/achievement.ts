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
  AchievementResponse,
  CreateAchievementBaseBody,
  GetUserAchievementsBaseParams,
  GrantAchievementBase201,
  GrantAchievementBaseBody,
  UpdateAchievementBaseBody,
  UploadIconBaseBodyTwo,
  UserAchievementResponse,
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

export const getGetAchievementsBaseUrl = () => {
  return `/achievements`;
};

/**
 * @summary List achievement definitions
 */
export const getAchievementsBase = async (
  options?: Parameters<typeof customFetch>[1],
): Promise<AchievementResponse[]> => {
  return customFetch<AchievementResponse[]>(getGetAchievementsBaseUrl(), {
    ...options,
    method: "GET",
  });
};

export const getGetAchievementsBaseQueryKey = () => {
  return [`/achievements`] as const;
};

export const getGetAchievementsBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getAchievementsBase>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getAchievementsBase>>,
      TError,
      TData
    >
  >;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAchievementsBaseQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getAchievementsBase>>
  > = ({ signal }) => getAchievementsBase({ signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAchievementsBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetAchievementsBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAchievementsBase>>
>;
export type GetAchievementsBaseQueryError = unknown;

export function useGetAchievementsBase<
  TData = Awaited<ReturnType<typeof getAchievementsBase>>,
  TError = unknown,
>(
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAchievementsBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAchievementsBase>>,
          TError,
          Awaited<ReturnType<typeof getAchievementsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetAchievementsBase<
  TData = Awaited<ReturnType<typeof getAchievementsBase>>,
  TError = unknown,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAchievementsBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAchievementsBase>>,
          TError,
          Awaited<ReturnType<typeof getAchievementsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetAchievementsBase<
  TData = Awaited<ReturnType<typeof getAchievementsBase>>,
  TError = unknown,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAchievementsBase>>,
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
/**
 * @summary List achievement definitions
 */

export function useGetAchievementsBase<
  TData = Awaited<ReturnType<typeof getAchievementsBase>>,
  TError = unknown,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAchievementsBase>>,
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
  const queryOptions = getGetAchievementsBaseQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getCreateAchievementBaseUrl = () => {
  return `/achievements`;
};

/**
 * @summary Create a custom achievement
 */
export const createAchievementBase = async (
  createAchievementBaseBody: CreateAchievementBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<AchievementResponse> => {
  return customFetch<AchievementResponse>(getCreateAchievementBaseUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createAchievementBaseBody),
  });
};

export const getCreateAchievementBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createAchievementBase>>,
    TError,
    { data: CreateAchievementBaseBody },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createAchievementBase>>,
  TError,
  { data: CreateAchievementBaseBody },
  TContext
> => {
  const mutationKey = ["createAchievementBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createAchievementBase>>,
    { data: CreateAchievementBaseBody }
  > = (props) => {
    const { data } = props ?? {};

    return createAchievementBase(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateAchievementBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof createAchievementBase>>
>;
export type CreateAchievementBaseMutationBody = CreateAchievementBaseBody;
export type CreateAchievementBaseMutationError = unknown;

/**
 * @summary Create a custom achievement
 */
export const useCreateAchievementBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createAchievementBase>>,
      TError,
      { data: CreateAchievementBaseBody },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createAchievementBase>>,
  TError,
  { data: CreateAchievementBaseBody },
  TContext
> => {
  return useMutation(
    getCreateAchievementBaseMutationOptions(options),
    queryClient,
  );
};
export const getSyncAchievementsBaseUrl = () => {
  return `/achievements/sync`;
};

/**
 * @summary Trigger system achievement sync
 */
export const syncAchievementsBase = async (
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
  return customFetch<void>(getSyncAchievementsBaseUrl(), {
    ...options,
    method: "POST",
  });
};

export const getSyncAchievementsBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof syncAchievementsBase>>,
    TError,
    void,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof syncAchievementsBase>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ["syncAchievementsBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof syncAchievementsBase>>,
    void
  > = () => {
    return syncAchievementsBase(requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type SyncAchievementsBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof syncAchievementsBase>>
>;

export type SyncAchievementsBaseMutationError = unknown;

/**
 * @summary Trigger system achievement sync
 */
export const useSyncAchievementsBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof syncAchievementsBase>>,
      TError,
      void,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof syncAchievementsBase>>,
  TError,
  void,
  TContext
> => {
  return useMutation(
    getSyncAchievementsBaseMutationOptions(options),
    queryClient,
  );
};
export const getDeleteAchievementBaseUrl = (achievementId: number) => {
  return `/achievements/${achievementId}`;
};

/**
 * @summary Delete a custom achievement
 */
export const deleteAchievementBase = async (
  achievementId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
  return customFetch<void>(getDeleteAchievementBaseUrl(achievementId), {
    ...options,
    method: "DELETE",
  });
};

export const getDeleteAchievementBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteAchievementBase>>,
    TError,
    { achievementId: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteAchievementBase>>,
  TError,
  { achievementId: number },
  TContext
> => {
  const mutationKey = ["deleteAchievementBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteAchievementBase>>,
    { achievementId: number }
  > = (props) => {
    const { achievementId } = props ?? {};

    return deleteAchievementBase(achievementId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteAchievementBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteAchievementBase>>
>;

export type DeleteAchievementBaseMutationError = unknown;

/**
 * @summary Delete a custom achievement
 */
export const useDeleteAchievementBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteAchievementBase>>,
      TError,
      { achievementId: number },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteAchievementBase>>,
  TError,
  { achievementId: number },
  TContext
> => {
  return useMutation(
    getDeleteAchievementBaseMutationOptions(options),
    queryClient,
  );
};
export const getUpdateAchievementBaseUrl = (achievementId: number) => {
  return `/achievements/${achievementId}`;
};

/**
 * @summary Update a custom achievement
 */
export const updateAchievementBase = async (
  achievementId: number,
  updateAchievementBaseBody: UpdateAchievementBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<AchievementResponse> => {
  return customFetch<AchievementResponse>(
    getUpdateAchievementBaseUrl(achievementId),
    {
      ...options,
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(updateAchievementBaseBody),
    },
  );
};

export const getUpdateAchievementBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateAchievementBase>>,
    TError,
    { achievementId: number; data: UpdateAchievementBaseBody },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateAchievementBase>>,
  TError,
  { achievementId: number; data: UpdateAchievementBaseBody },
  TContext
> => {
  const mutationKey = ["updateAchievementBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateAchievementBase>>,
    { achievementId: number; data: UpdateAchievementBaseBody }
  > = (props) => {
    const { achievementId, data } = props ?? {};

    return updateAchievementBase(achievementId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateAchievementBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateAchievementBase>>
>;
export type UpdateAchievementBaseMutationBody = UpdateAchievementBaseBody;
export type UpdateAchievementBaseMutationError = unknown;

/**
 * @summary Update a custom achievement
 */
export const useUpdateAchievementBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateAchievementBase>>,
      TError,
      { achievementId: number; data: UpdateAchievementBaseBody },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateAchievementBase>>,
  TError,
  { achievementId: number; data: UpdateAchievementBaseBody },
  TContext
> => {
  return useMutation(
    getUpdateAchievementBaseMutationOptions(options),
    queryClient,
  );
};
export const getGetIconBaseUrl = (achievementId: number) => {
  return `/achievements/${achievementId}/icon`;
};

/**
 * @summary Get the icon for an achievement
 */
export const getIconBase = async (
  achievementId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<Blob> => {
  return customFetch<Blob>(getGetIconBaseUrl(achievementId), {
    ...options,
    method: "GET",
  });
};

export const getGetIconBaseQueryKey = (achievementId: number) => {
  return [`/achievements/${achievementId}/icon`] as const;
};

export const getGetIconBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getIconBase>>,
  TError = unknown,
>(
  achievementId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getIconBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetIconBaseQueryKey(achievementId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getIconBase>>> = ({
    signal,
  }) => getIconBase(achievementId, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: achievementId !== null && achievementId !== undefined,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getIconBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetIconBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getIconBase>>
>;
export type GetIconBaseQueryError = unknown;

export function useGetIconBase<
  TData = Awaited<ReturnType<typeof getIconBase>>,
  TError = unknown,
>(
  achievementId: number,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getIconBase>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getIconBase>>,
          TError,
          Awaited<ReturnType<typeof getIconBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetIconBase<
  TData = Awaited<ReturnType<typeof getIconBase>>,
  TError = unknown,
>(
  achievementId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getIconBase>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getIconBase>>,
          TError,
          Awaited<ReturnType<typeof getIconBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetIconBase<
  TData = Awaited<ReturnType<typeof getIconBase>>,
  TError = unknown,
>(
  achievementId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getIconBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary Get the icon for an achievement
 */

export function useGetIconBase<
  TData = Awaited<ReturnType<typeof getIconBase>>,
  TError = unknown,
>(
  achievementId: number,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getIconBase>>, TError, TData>
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetIconBaseQueryOptions(achievementId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getUploadIconBaseUrl = (achievementId: number) => {
  return `/achievements/${achievementId}/icon`;
};

/**
 * @summary Upload an icon for an achievement
 */
export const uploadIconBase = async (
  achievementId: number,
  uploadIconBaseBody: unknown | UploadIconBaseBodyTwo,
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
  return customFetch<void>(getUploadIconBaseUrl(achievementId), {
    ...options,
    method: "PUT",
    body: JSON.stringify(uploadIconBaseBody),
  });
};

export const getUploadIconBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof uploadIconBase>>,
    TError,
    { achievementId: number; data: unknown | UploadIconBaseBodyTwo },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof uploadIconBase>>,
  TError,
  { achievementId: number; data: unknown | UploadIconBaseBodyTwo },
  TContext
> => {
  const mutationKey = ["uploadIconBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof uploadIconBase>>,
    { achievementId: number; data: unknown | UploadIconBaseBodyTwo }
  > = (props) => {
    const { achievementId, data } = props ?? {};

    return uploadIconBase(achievementId, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UploadIconBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof uploadIconBase>>
>;
export type UploadIconBaseMutationBody = unknown | UploadIconBaseBodyTwo;
export type UploadIconBaseMutationError = unknown;

/**
 * @summary Upload an icon for an achievement
 */
export const useUploadIconBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof uploadIconBase>>,
      TError,
      { achievementId: number; data: unknown | UploadIconBaseBodyTwo },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof uploadIconBase>>,
  TError,
  { achievementId: number; data: unknown | UploadIconBaseBodyTwo },
  TContext
> => {
  return useMutation(getUploadIconBaseMutationOptions(options), queryClient);
};
export const getGetUserAchievementsBaseUrl = (
  params?: GetUserAchievementsBaseParams,
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : String(value));
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0
    ? `/user-achievements?${stringifiedParams}`
    : `/user-achievements`;
};

/**
 * @summary List user achievement grants
 */
export const getUserAchievementsBase = async (
  params?: GetUserAchievementsBaseParams,
  options?: Parameters<typeof customFetch>[1],
): Promise<UserAchievementResponse[]> => {
  return customFetch<UserAchievementResponse[]>(
    getGetUserAchievementsBaseUrl(params),
    {
      ...options,
      method: "GET",
    },
  );
};

export const getGetUserAchievementsBaseQueryKey = (
  params?: GetUserAchievementsBaseParams,
) => {
  return [`/user-achievements`, ...(params ? [params] : [])] as const;
};

export const getGetUserAchievementsBaseQueryOptions = <
  TData = Awaited<ReturnType<typeof getUserAchievementsBase>>,
  TError = unknown,
>(
  params?: GetUserAchievementsBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserAchievementsBase>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customFetch>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetUserAchievementsBaseQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getUserAchievementsBase>>
  > = ({ signal }) =>
    getUserAchievementsBase(params, { signal, ...requestOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUserAchievementsBase>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetUserAchievementsBaseQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUserAchievementsBase>>
>;
export type GetUserAchievementsBaseQueryError = unknown;

export function useGetUserAchievementsBase<
  TData = Awaited<ReturnType<typeof getUserAchievementsBase>>,
  TError = unknown,
>(
  params: undefined | GetUserAchievementsBaseParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserAchievementsBase>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserAchievementsBase>>,
          TError,
          Awaited<ReturnType<typeof getUserAchievementsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetUserAchievementsBase<
  TData = Awaited<ReturnType<typeof getUserAchievementsBase>>,
  TError = unknown,
>(
  params?: GetUserAchievementsBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserAchievementsBase>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserAchievementsBase>>,
          TError,
          Awaited<ReturnType<typeof getUserAchievementsBase>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetUserAchievementsBase<
  TData = Awaited<ReturnType<typeof getUserAchievementsBase>>,
  TError = unknown,
>(
  params?: GetUserAchievementsBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserAchievementsBase>>,
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
/**
 * @summary List user achievement grants
 */

export function useGetUserAchievementsBase<
  TData = Awaited<ReturnType<typeof getUserAchievementsBase>>,
  TError = unknown,
>(
  params?: GetUserAchievementsBaseParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getUserAchievementsBase>>,
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
  const queryOptions = getGetUserAchievementsBaseQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}

export const getGrantAchievementBaseUrl = () => {
  return `/user-achievements`;
};

/**
 * @summary Grant an achievement to a user
 */
export const grantAchievementBase = async (
  grantAchievementBaseBody: GrantAchievementBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<GrantAchievementBase201> => {
  return customFetch<GrantAchievementBase201>(getGrantAchievementBaseUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(grantAchievementBaseBody),
  });
};

export const getGrantAchievementBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof grantAchievementBase>>,
    TError,
    { data: GrantAchievementBaseBody },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof grantAchievementBase>>,
  TError,
  { data: GrantAchievementBaseBody },
  TContext
> => {
  const mutationKey = ["grantAchievementBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof grantAchievementBase>>,
    { data: GrantAchievementBaseBody }
  > = (props) => {
    const { data } = props ?? {};

    return grantAchievementBase(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type GrantAchievementBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof grantAchievementBase>>
>;
export type GrantAchievementBaseMutationBody = GrantAchievementBaseBody;
export type GrantAchievementBaseMutationError = unknown;

/**
 * @summary Grant an achievement to a user
 */
export const useGrantAchievementBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof grantAchievementBase>>,
      TError,
      { data: GrantAchievementBaseBody },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof grantAchievementBase>>,
  TError,
  { data: GrantAchievementBaseBody },
  TContext
> => {
  return useMutation(
    getGrantAchievementBaseMutationOptions(options),
    queryClient,
  );
};
export const getRevokeAchievementBaseUrl = (
  userId: number,
  achievementId: number,
) => {
  return `/user-achievements/${userId}/${achievementId}`;
};

/**
 * @summary Revoke an achievement from a user
 */
export const revokeAchievementBase = async (
  userId: number,
  achievementId: number,
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
  return customFetch<void>(getRevokeAchievementBaseUrl(userId, achievementId), {
    ...options,
    method: "DELETE",
  });
};

export const getRevokeAchievementBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof revokeAchievementBase>>,
    TError,
    { userId: number; achievementId: number },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof revokeAchievementBase>>,
  TError,
  { userId: number; achievementId: number },
  TContext
> => {
  const mutationKey = ["revokeAchievementBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof revokeAchievementBase>>,
    { userId: number; achievementId: number }
  > = (props) => {
    const { userId, achievementId } = props ?? {};

    return revokeAchievementBase(userId, achievementId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RevokeAchievementBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof revokeAchievementBase>>
>;

export type RevokeAchievementBaseMutationError = unknown;

/**
 * @summary Revoke an achievement from a user
 */
export const useRevokeAchievementBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof revokeAchievementBase>>,
      TError,
      { userId: number; achievementId: number },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof revokeAchievementBase>>,
  TError,
  { userId: number; achievementId: number },
  TContext
> => {
  return useMutation(
    getRevokeAchievementBaseMutationOptions(options),
    queryClient,
  );
};
