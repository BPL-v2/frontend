import { useMutation } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type { AddEngagementBaseBody } from "../models";

import { customFetch } from "../../fetcher.ts";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getAddEngagementBaseUrl = () => {
  return `/engagement`;
};

/**
 * Add a new engagement or increment existing engagement number
 */
export const addEngagementBase = async (
  addEngagementBaseBody: AddEngagementBaseBody,
  options?: Parameters<typeof customFetch>[1],
): Promise<void> => {
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
  return customFetch<void>(getAddEngagementBaseUrl(), {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(options?.headers),
    },
    body: JSON.stringify(addEngagementBaseBody),
  });
};

export const getAddEngagementBaseMutationKey = () =>
  ["addEngagementBase"] as const;

export const getAddEngagementBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addEngagementBase>>,
    TError,
    AddEngagementBaseMutationVariables,
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof addEngagementBase>>,
  TError,
  AddEngagementBaseMutationVariables,
  TContext
> => {
  const mutationKey = getAddEngagementBaseMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof addEngagementBase>>,
    AddEngagementBaseMutationVariables
  > = (props) => {
    const { data } = props ?? {};

    return addEngagementBase(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AddEngagementBaseMutationResult = NonNullable<
  Awaited<ReturnType<typeof addEngagementBase>>
>;
export type AddEngagementBaseMutationBody = AddEngagementBaseBody;
export type AddEngagementBaseMutationError = unknown;
export type AddEngagementBaseMutationVariables = {
  data: AddEngagementBaseBody;
};

export const useAddEngagementBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof addEngagementBase>>,
      TError,
      AddEngagementBaseMutationVariables,
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof addEngagementBase>>,
  TError,
  AddEngagementBaseMutationVariables,
  TContext
> => {
  return useMutation(getAddEngagementBaseMutationOptions(options), queryClient);
};
