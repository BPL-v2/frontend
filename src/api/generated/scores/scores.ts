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
  ScoreDiff,
  SimpleScoreWebSocketBase200
} from '../models';

import { customFetch } from '../../fetcher';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * Fetches the latest scores for the current event
 */
export const getGetLatestScoresForEventBaseUrl = (eventId: number,) => {




  return `/events/${eventId}/scores/latest`
}

export const getLatestScoresForEventBase = async (eventId: number, options?: RequestInit): Promise<ScoreDiff[]> => {

  return customFetch<ScoreDiff[]>(getGetLatestScoresForEventBaseUrl(eventId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetLatestScoresForEventBaseQueryKey = (eventId: number,) => {
    return [
    `/events/${eventId}/scores/latest`
    ] as const;
    }


export const getGetLatestScoresForEventBaseQueryOptions = <TData = Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError = unknown>(eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetLatestScoresForEventBaseQueryKey(eventId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getLatestScoresForEventBase>>> = ({ signal }) => getLatestScoresForEventBase(eventId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(eventId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetLatestScoresForEventBaseQueryResult = NonNullable<Awaited<ReturnType<typeof getLatestScoresForEventBase>>>
export type GetLatestScoresForEventBaseQueryError = unknown


export function useGetLatestScoresForEventBase<TData = Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError = unknown>(
 eventId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getLatestScoresForEventBase>>,
          TError,
          Awaited<ReturnType<typeof getLatestScoresForEventBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetLatestScoresForEventBase<TData = Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getLatestScoresForEventBase>>,
          TError,
          Awaited<ReturnType<typeof getLatestScoresForEventBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetLatestScoresForEventBase<TData = Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetLatestScoresForEventBase<TData = Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getLatestScoresForEventBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetLatestScoresForEventBaseQueryOptions(eventId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}






/**
 * Websocket for simple score updates.
 */
export const getSimpleScoreWebSocketBaseUrl = (eventId: number,) => {




  return `/events/${eventId}/scores/simple/ws`
}

export const simpleScoreWebSocketBase = async (eventId: number, options?: RequestInit): Promise<SimpleScoreWebSocketBase200> => {

  return customFetch<SimpleScoreWebSocketBase200>(getSimpleScoreWebSocketBaseUrl(eventId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSimpleScoreWebSocketBaseQueryKey = (eventId: number,) => {
    return [
    `/events/${eventId}/scores/simple/ws`
    ] as const;
    }


export const getSimpleScoreWebSocketBaseQueryOptions = <TData = Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError = unknown>(eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSimpleScoreWebSocketBaseQueryKey(eventId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof simpleScoreWebSocketBase>>> = ({ signal }) => simpleScoreWebSocketBase(eventId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(eventId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SimpleScoreWebSocketBaseQueryResult = NonNullable<Awaited<ReturnType<typeof simpleScoreWebSocketBase>>>
export type SimpleScoreWebSocketBaseQueryError = unknown


export function useSimpleScoreWebSocketBase<TData = Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError = unknown>(
 eventId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof simpleScoreWebSocketBase>>,
          TError,
          Awaited<ReturnType<typeof simpleScoreWebSocketBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSimpleScoreWebSocketBase<TData = Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof simpleScoreWebSocketBase>>,
          TError,
          Awaited<ReturnType<typeof simpleScoreWebSocketBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSimpleScoreWebSocketBase<TData = Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSimpleScoreWebSocketBase<TData = Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof simpleScoreWebSocketBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSimpleScoreWebSocketBaseQueryOptions(eventId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}






/**
 * Websocket for score updates. Once connected, the client will receive score updates in real-time.
 */
export const getScoreWebSocketBaseUrl = (eventId: number,) => {




  return `/events/${eventId}/scores/ws`
}

export const scoreWebSocketBase = async (eventId: number, options?: RequestInit): Promise<ScoreDiff> => {

  return customFetch<ScoreDiff>(getScoreWebSocketBaseUrl(eventId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getScoreWebSocketBaseQueryKey = (eventId: number,) => {
    return [
    `/events/${eventId}/scores/ws`
    ] as const;
    }


export const getScoreWebSocketBaseQueryOptions = <TData = Awaited<ReturnType<typeof scoreWebSocketBase>>, TError = unknown>(eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof scoreWebSocketBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getScoreWebSocketBaseQueryKey(eventId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof scoreWebSocketBase>>> = ({ signal }) => scoreWebSocketBase(eventId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(eventId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof scoreWebSocketBase>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ScoreWebSocketBaseQueryResult = NonNullable<Awaited<ReturnType<typeof scoreWebSocketBase>>>
export type ScoreWebSocketBaseQueryError = unknown


export function useScoreWebSocketBase<TData = Awaited<ReturnType<typeof scoreWebSocketBase>>, TError = unknown>(
 eventId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof scoreWebSocketBase>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof scoreWebSocketBase>>,
          TError,
          Awaited<ReturnType<typeof scoreWebSocketBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useScoreWebSocketBase<TData = Awaited<ReturnType<typeof scoreWebSocketBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof scoreWebSocketBase>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof scoreWebSocketBase>>,
          TError,
          Awaited<ReturnType<typeof scoreWebSocketBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useScoreWebSocketBase<TData = Awaited<ReturnType<typeof scoreWebSocketBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof scoreWebSocketBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useScoreWebSocketBase<TData = Awaited<ReturnType<typeof scoreWebSocketBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof scoreWebSocketBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getScoreWebSocketBaseQueryOptions(eventId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}






