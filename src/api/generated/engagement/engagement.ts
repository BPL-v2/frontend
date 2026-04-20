import { useMutation } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type { AddEngagementBaseBody } from "../models";

import { customFetch } from "../../fetcher";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * Add a new engagement or increment existing engagement number
 */
export const getAddEngagementBaseUrl = () => {
  return `/engagement`;
};

export const addEngagementBase = async (
  addEngagementBaseBody: AddEngagementBaseBody,
  options?: RequestInit,
): Promise<void> => {
  return customFetch<void>(getAddEngagementBaseUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(addEngagementBaseBody),
  });
};

export const getAddEngagementBaseMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof addEngagementBase>>,
    TError,
    { data: AddEngagementBaseBody },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof addEngagementBase>>,
  TError,
  { data: AddEngagementBaseBody },
  TContext
> => {
  const mutationKey = ["addEngagementBase"];
  const { mutation: mutationOptions, request: requestOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, request: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof addEngagementBase>>,
    { data: AddEngagementBaseBody }
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

export const useAddEngagementBase = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof addEngagementBase>>,
      TError,
      { data: AddEngagementBaseBody },
      TContext
    >;
    request?: SecondParameter<typeof customFetch>;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof addEngagementBase>>,
  TError,
  { data: AddEngagementBaseBody },
  TContext
> => {
  return useMutation(getAddEngagementBaseMutationOptions(options), queryClient);
};
