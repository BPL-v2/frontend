import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
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
  UseQueryResult
} from '@tanstack/react-query';

import type {
  SetTimingsBaseBody,
  Timing
} from '../models';

import { customFetch } from '../../fetcher';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * Retrieve the current timing configurations for various operations.
 * @summary Get timing configurations
 */
export const getGetTimingsBaseUrl = () => {




  return `/timings`
}

export const getTimingsBase = async ( options?: RequestInit): Promise<Timing[]> => {

  return customFetch<Timing[]>(getGetTimingsBaseUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetTimingsBaseQueryKey = () => {
    return [
    `/timings`
    ] as const;
    }


export const getGetTimingsBaseQueryOptions = <TData = Awaited<ReturnType<typeof getTimingsBase>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimingsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTimingsBaseQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTimingsBase>>> = ({ signal }) => getTimingsBase({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTimingsBase>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTimingsBaseQueryResult = NonNullable<Awaited<ReturnType<typeof getTimingsBase>>>
export type GetTimingsBaseQueryError = unknown


export function useGetTimingsBase<TData = Awaited<ReturnType<typeof getTimingsBase>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimingsBase>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTimingsBase>>,
          TError,
          Awaited<ReturnType<typeof getTimingsBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetTimingsBase<TData = Awaited<ReturnType<typeof getTimingsBase>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimingsBase>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTimingsBase>>,
          TError,
          Awaited<ReturnType<typeof getTimingsBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetTimingsBase<TData = Awaited<ReturnType<typeof getTimingsBase>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimingsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get timing configurations
 */

export function useGetTimingsBase<TData = Awaited<ReturnType<typeof getTimingsBase>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimingsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTimingsBaseQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}






/**
 * Update the timing configurations for various operations.
 * @summary Set timing configurations
 */
export const getSetTimingsBaseUrl = () => {




  return `/timings`
}

export const setTimingsBase = async (setTimingsBaseBody: SetTimingsBaseBody, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getSetTimingsBaseUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      setTimingsBaseBody,)
  }
);}




export const getSetTimingsBaseMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof setTimingsBase>>, TError,{data: SetTimingsBaseBody}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof setTimingsBase>>, TError,{data: SetTimingsBaseBody}, TContext> => {

const mutationKey = ['setTimingsBase'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof setTimingsBase>>, {data: SetTimingsBaseBody}> = (props) => {
          const {data} = props ?? {};

          return  setTimingsBase(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SetTimingsBaseMutationResult = NonNullable<Awaited<ReturnType<typeof setTimingsBase>>>
    export type SetTimingsBaseMutationBody = SetTimingsBaseBody
    export type SetTimingsBaseMutationError = unknown

    /**
 * @summary Set timing configurations
 */
export const useSetTimingsBase = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof setTimingsBase>>, TError,{data: SetTimingsBaseBody}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof setTimingsBase>>,
        TError,
        {data: SetTimingsBaseBody},
        TContext
      > => {
      return useMutation(getSetTimingsBaseMutationOptions(options), queryClient);
    }
