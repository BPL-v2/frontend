import {
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  TwitchStream
} from '../models';

import { customFetch } from '../../fetcher';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * Fetches all twitch streams for the current event
 */
export const getGetStreamsBaseUrl = (eventId: number,) => {




  return `/events/${eventId}/streams`
}

export const getStreamsBase = async (eventId: number, options?: RequestInit): Promise<TwitchStream[]> => {

  return customFetch<TwitchStream[]>(getGetStreamsBaseUrl(eventId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetStreamsBaseQueryKey = (eventId: number,) => {
    return [
    `/events/${eventId}/streams`
    ] as const;
    }


export const getGetStreamsBaseQueryOptions = <TData = Awaited<ReturnType<typeof getStreamsBase>>, TError = unknown>(eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStreamsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetStreamsBaseQueryKey(eventId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getStreamsBase>>> = ({ signal }) => getStreamsBase(eventId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(eventId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getStreamsBase>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetStreamsBaseQueryResult = NonNullable<Awaited<ReturnType<typeof getStreamsBase>>>
export type GetStreamsBaseQueryError = unknown


export function useGetStreamsBase<TData = Awaited<ReturnType<typeof getStreamsBase>>, TError = unknown>(
 eventId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStreamsBase>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getStreamsBase>>,
          TError,
          Awaited<ReturnType<typeof getStreamsBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetStreamsBase<TData = Awaited<ReturnType<typeof getStreamsBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStreamsBase>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getStreamsBase>>,
          TError,
          Awaited<ReturnType<typeof getStreamsBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetStreamsBase<TData = Awaited<ReturnType<typeof getStreamsBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStreamsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetStreamsBase<TData = Awaited<ReturnType<typeof getStreamsBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getStreamsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetStreamsBaseQueryOptions(eventId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}






