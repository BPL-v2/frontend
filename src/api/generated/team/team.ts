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
  AddUsersToTeamsBaseBody,
  CreateObjectiveTeamSuggestionBase201,
  CreateObjectiveTeamSuggestionBaseBody,
  CreateTeamBaseBody,
  SortedUser,
  Team,
  TeamSuggestion
} from '../models';

import { customFetch } from '../../fetcher';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * Fetches all teams for an event
 */
export const getGetTeamsBaseUrl = (eventId: number,) => {




  return `/events/${eventId}/teams`
}

export const getTeamsBase = async (eventId: number, options?: RequestInit): Promise<Team[]> => {

  return customFetch<Team[]>(getGetTeamsBaseUrl(eventId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetTeamsBaseQueryKey = (eventId: number,) => {
    return [
    `/events/${eventId}/teams`
    ] as const;
    }


export const getGetTeamsBaseQueryOptions = <TData = Awaited<ReturnType<typeof getTeamsBase>>, TError = unknown>(eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTeamsBaseQueryKey(eventId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTeamsBase>>> = ({ signal }) => getTeamsBase(eventId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(eventId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTeamsBaseQueryResult = NonNullable<Awaited<ReturnType<typeof getTeamsBase>>>
export type GetTeamsBaseQueryError = unknown


export function useGetTeamsBase<TData = Awaited<ReturnType<typeof getTeamsBase>>, TError = unknown>(
 eventId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamsBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamsBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetTeamsBase<TData = Awaited<ReturnType<typeof getTeamsBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamsBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamsBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetTeamsBase<TData = Awaited<ReturnType<typeof getTeamsBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTeamsBase<TData = Awaited<ReturnType<typeof getTeamsBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTeamsBaseQueryOptions(eventId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}






/**
 * Creates a team for an event
 */
export const getCreateTeamBaseUrl = (eventId: number,) => {




  return `/events/${eventId}/teams`
}

export const createTeamBase = async (eventId: number,
    createTeamBaseBody: CreateTeamBaseBody, options?: RequestInit): Promise<Team> => {

  return customFetch<Team>(getCreateTeamBaseUrl(eventId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      createTeamBaseBody,)
  }
);}




export const getCreateTeamBaseMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createTeamBase>>, TError,{eventId: number;data: CreateTeamBaseBody}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createTeamBase>>, TError,{eventId: number;data: CreateTeamBaseBody}, TContext> => {

const mutationKey = ['createTeamBase'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createTeamBase>>, {eventId: number;data: CreateTeamBaseBody}> = (props) => {
          const {eventId,data} = props ?? {};

          return  createTeamBase(eventId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateTeamBaseMutationResult = NonNullable<Awaited<ReturnType<typeof createTeamBase>>>
    export type CreateTeamBaseMutationBody = CreateTeamBaseBody
    export type CreateTeamBaseMutationError = unknown

    export const useCreateTeamBase = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createTeamBase>>, TError,{eventId: number;data: CreateTeamBaseBody}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createTeamBase>>,
        TError,
        {eventId: number;data: CreateTeamBaseBody},
        TContext
      > => {
      return useMutation(getCreateTeamBaseMutationOptions(options), queryClient);
    }
    /**
 * Fetches all users of an event sorted by team and role
 */
export const getGetSortedUsersBaseUrl = (eventId: number,) => {




  return `/events/${eventId}/teams/users`
}

export const getSortedUsersBase = async (eventId: number, options?: RequestInit): Promise<SortedUser[]> => {

  return customFetch<SortedUser[]>(getGetSortedUsersBaseUrl(eventId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetSortedUsersBaseQueryKey = (eventId: number,) => {
    return [
    `/events/${eventId}/teams/users`
    ] as const;
    }


export const getGetSortedUsersBaseQueryOptions = <TData = Awaited<ReturnType<typeof getSortedUsersBase>>, TError = unknown>(eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSortedUsersBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSortedUsersBaseQueryKey(eventId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSortedUsersBase>>> = ({ signal }) => getSortedUsersBase(eventId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(eventId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getSortedUsersBase>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSortedUsersBaseQueryResult = NonNullable<Awaited<ReturnType<typeof getSortedUsersBase>>>
export type GetSortedUsersBaseQueryError = unknown


export function useGetSortedUsersBase<TData = Awaited<ReturnType<typeof getSortedUsersBase>>, TError = unknown>(
 eventId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSortedUsersBase>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSortedUsersBase>>,
          TError,
          Awaited<ReturnType<typeof getSortedUsersBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetSortedUsersBase<TData = Awaited<ReturnType<typeof getSortedUsersBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSortedUsersBase>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSortedUsersBase>>,
          TError,
          Awaited<ReturnType<typeof getSortedUsersBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetSortedUsersBase<TData = Awaited<ReturnType<typeof getSortedUsersBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSortedUsersBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSortedUsersBase<TData = Awaited<ReturnType<typeof getSortedUsersBase>>, TError = unknown>(
 eventId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSortedUsersBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSortedUsersBaseQueryOptions(eventId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}






/**
 * Adds users to teams
 */
export const getAddUsersToTeamsBaseUrl = (eventId: number,) => {




  return `/events/${eventId}/teams/users`
}

export const addUsersToTeamsBase = async (eventId: number,
    addUsersToTeamsBaseBody: AddUsersToTeamsBaseBody, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAddUsersToTeamsBaseUrl(eventId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      addUsersToTeamsBaseBody,)
  }
);}




export const getAddUsersToTeamsBaseMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addUsersToTeamsBase>>, TError,{eventId: number;data: AddUsersToTeamsBaseBody}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof addUsersToTeamsBase>>, TError,{eventId: number;data: AddUsersToTeamsBaseBody}, TContext> => {

const mutationKey = ['addUsersToTeamsBase'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof addUsersToTeamsBase>>, {eventId: number;data: AddUsersToTeamsBaseBody}> = (props) => {
          const {eventId,data} = props ?? {};

          return  addUsersToTeamsBase(eventId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AddUsersToTeamsBaseMutationResult = NonNullable<Awaited<ReturnType<typeof addUsersToTeamsBase>>>
    export type AddUsersToTeamsBaseMutationBody = AddUsersToTeamsBaseBody
    export type AddUsersToTeamsBaseMutationError = unknown

    export const useAddUsersToTeamsBase = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof addUsersToTeamsBase>>, TError,{eventId: number;data: AddUsersToTeamsBaseBody}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof addUsersToTeamsBase>>,
        TError,
        {eventId: number;data: AddUsersToTeamsBaseBody},
        TContext
      > => {
      return useMutation(getAddUsersToTeamsBaseMutationOptions(options), queryClient);
    }
    /**
 * Deletes a team
 */
export const getDeleteTeamBaseUrl = (eventId: number,
    teamId: number,) => {




  return `/events/${eventId}/teams/${teamId}`
}

export const deleteTeamBase = async (eventId: number,
    teamId: number, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getDeleteTeamBaseUrl(eventId,teamId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getDeleteTeamBaseMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteTeamBase>>, TError,{eventId: number;teamId: number}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteTeamBase>>, TError,{eventId: number;teamId: number}, TContext> => {

const mutationKey = ['deleteTeamBase'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteTeamBase>>, {eventId: number;teamId: number}> = (props) => {
          const {eventId,teamId} = props ?? {};

          return  deleteTeamBase(eventId,teamId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DeleteTeamBaseMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTeamBase>>>

    export type DeleteTeamBaseMutationError = unknown

    export const useDeleteTeamBase = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteTeamBase>>, TError,{eventId: number;teamId: number}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteTeamBase>>,
        TError,
        {eventId: number;teamId: number},
        TContext
      > => {
      return useMutation(getDeleteTeamBaseMutationOptions(options), queryClient);
    }
    /**
 * Fetches a team by id
 */
export const getGetTeamBaseUrl = (eventId: number,
    teamId: number,) => {




  return `/events/${eventId}/teams/${teamId}`
}

export const getTeamBase = async (eventId: number,
    teamId: number, options?: RequestInit): Promise<Team> => {

  return customFetch<Team>(getGetTeamBaseUrl(eventId,teamId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetTeamBaseQueryKey = (eventId: number,
    teamId: number,) => {
    return [
    `/events/${eventId}/teams/${teamId}`
    ] as const;
    }


export const getGetTeamBaseQueryOptions = <TData = Awaited<ReturnType<typeof getTeamBase>>, TError = unknown>(eventId: number,
    teamId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTeamBaseQueryKey(eventId,teamId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTeamBase>>> = ({ signal }) => getTeamBase(eventId,teamId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(eventId && teamId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTeamBaseQueryResult = NonNullable<Awaited<ReturnType<typeof getTeamBase>>>
export type GetTeamBaseQueryError = unknown


export function useGetTeamBase<TData = Awaited<ReturnType<typeof getTeamBase>>, TError = unknown>(
 eventId: number,
    teamId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetTeamBase<TData = Awaited<ReturnType<typeof getTeamBase>>, TError = unknown>(
 eventId: number,
    teamId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetTeamBase<TData = Awaited<ReturnType<typeof getTeamBase>>, TError = unknown>(
 eventId: number,
    teamId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTeamBase<TData = Awaited<ReturnType<typeof getTeamBase>>, TError = unknown>(
 eventId: number,
    teamId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTeamBaseQueryOptions(eventId,teamId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}






/**
 * Fetches all suggestions for your team for an event
 */
export const getGetTeamSuggestionsBaseUrl = (eventId: number,
    teamId: number,) => {




  return `/events/${eventId}/teams/${teamId}/suggestions`
}

export const getTeamSuggestionsBase = async (eventId: number,
    teamId: number, options?: RequestInit): Promise<TeamSuggestion[]> => {

  return customFetch<TeamSuggestion[]>(getGetTeamSuggestionsBaseUrl(eventId,teamId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getGetTeamSuggestionsBaseQueryKey = (eventId: number,
    teamId: number,) => {
    return [
    `/events/${eventId}/teams/${teamId}/suggestions`
    ] as const;
    }


export const getGetTeamSuggestionsBaseQueryOptions = <TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError = unknown>(eventId: number,
    teamId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTeamSuggestionsBaseQueryKey(eventId,teamId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTeamSuggestionsBase>>> = ({ signal }) => getTeamSuggestionsBase(eventId,teamId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: !!(eventId && teamId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTeamSuggestionsBaseQueryResult = NonNullable<Awaited<ReturnType<typeof getTeamSuggestionsBase>>>
export type GetTeamSuggestionsBaseQueryError = unknown


export function useGetTeamSuggestionsBase<TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError = unknown>(
 eventId: number,
    teamId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamSuggestionsBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetTeamSuggestionsBase<TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError = unknown>(
 eventId: number,
    teamId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTeamSuggestionsBase>>,
          TError,
          Awaited<ReturnType<typeof getTeamSuggestionsBase>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetTeamSuggestionsBase<TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError = unknown>(
 eventId: number,
    teamId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTeamSuggestionsBase<TData = Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError = unknown>(
 eventId: number,
    teamId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTeamSuggestionsBase>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTeamSuggestionsBaseQueryOptions(eventId,teamId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}






/**
 * Deletes a suggestion for an objective for your team for an event
 */
export const getDeleteObjectiveTeamSuggestionBaseUrl = (eventId: number,
    teamId: number,
    objectiveId: number,) => {




  return `/events/${eventId}/teams/${teamId}/suggestions/${objectiveId}`
}

export const deleteObjectiveTeamSuggestionBase = async (eventId: number,
    teamId: number,
    objectiveId: number, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getDeleteObjectiveTeamSuggestionBaseUrl(eventId,teamId,objectiveId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getDeleteObjectiveTeamSuggestionBaseMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>, TError,{eventId: number;teamId: number;objectiveId: number}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>, TError,{eventId: number;teamId: number;objectiveId: number}, TContext> => {

const mutationKey = ['deleteObjectiveTeamSuggestionBase'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>, {eventId: number;teamId: number;objectiveId: number}> = (props) => {
          const {eventId,teamId,objectiveId} = props ?? {};

          return  deleteObjectiveTeamSuggestionBase(eventId,teamId,objectiveId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type DeleteObjectiveTeamSuggestionBaseMutationResult = NonNullable<Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>>

    export type DeleteObjectiveTeamSuggestionBaseMutationError = unknown

    export const useDeleteObjectiveTeamSuggestionBase = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>, TError,{eventId: number;teamId: number;objectiveId: number}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteObjectiveTeamSuggestionBase>>,
        TError,
        {eventId: number;teamId: number;objectiveId: number},
        TContext
      > => {
      return useMutation(getDeleteObjectiveTeamSuggestionBaseMutationOptions(options), queryClient);
    }
    /**
 * Creates a suggestion for an objective for your team for an event
 */
export const getCreateObjectiveTeamSuggestionBaseUrl = (eventId: number,
    teamId: number,
    objectiveId: number,) => {




  return `/events/${eventId}/teams/${teamId}/suggestions/${objectiveId}`
}

export const createObjectiveTeamSuggestionBase = async (eventId: number,
    teamId: number,
    objectiveId: number,
    createObjectiveTeamSuggestionBaseBody: CreateObjectiveTeamSuggestionBaseBody, options?: RequestInit): Promise<CreateObjectiveTeamSuggestionBase201> => {

  return customFetch<CreateObjectiveTeamSuggestionBase201>(getCreateObjectiveTeamSuggestionBaseUrl(eventId,teamId,objectiveId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(
      createObjectiveTeamSuggestionBaseBody,)
  }
);}




export const getCreateObjectiveTeamSuggestionBaseMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>, TError,{eventId: number;teamId: number;objectiveId: number;data: CreateObjectiveTeamSuggestionBaseBody}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>, TError,{eventId: number;teamId: number;objectiveId: number;data: CreateObjectiveTeamSuggestionBaseBody}, TContext> => {

const mutationKey = ['createObjectiveTeamSuggestionBase'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>, {eventId: number;teamId: number;objectiveId: number;data: CreateObjectiveTeamSuggestionBaseBody}> = (props) => {
          const {eventId,teamId,objectiveId,data} = props ?? {};

          return  createObjectiveTeamSuggestionBase(eventId,teamId,objectiveId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CreateObjectiveTeamSuggestionBaseMutationResult = NonNullable<Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>>
    export type CreateObjectiveTeamSuggestionBaseMutationBody = CreateObjectiveTeamSuggestionBaseBody
    export type CreateObjectiveTeamSuggestionBaseMutationError = unknown

    export const useCreateObjectiveTeamSuggestionBase = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>, TError,{eventId: number;teamId: number;objectiveId: number;data: CreateObjectiveTeamSuggestionBaseBody}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createObjectiveTeamSuggestionBase>>,
        TError,
        {eventId: number;teamId: number;objectiveId: number;data: CreateObjectiveTeamSuggestionBaseBody},
        TContext
      > => {
      return useMutation(getCreateObjectiveTeamSuggestionBaseMutationOptions(options), queryClient);
    }
