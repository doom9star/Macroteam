import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type CError = {
  __typename?: 'CError';
  message: Scalars['String'];
  property: Scalars['String'];
};

export type Channel = {
  __typename?: 'Channel';
  createdAt: Scalars['DateTime'];
  events: Array<Event>;
  id: Scalars['String'];
  members: Array<User>;
  messages: Array<Message>;
  name: Scalars['String'];
  owners: Array<Scalars['String']>;
  team: Team;
  updatedAt: Scalars['DateTime'];
};

export type ChannelResponse = {
  __typename?: 'ChannelResponse';
  channel?: Maybe<Channel>;
  errors?: Maybe<Array<CError>>;
};

export type CreateEventInput = {
  channelId: Scalars['String'];
  end: Scalars['DateTime'];
  resource: Scalars['String'];
  start: Scalars['DateTime'];
  title: Scalars['String'];
};

export type EditEventInput = {
  end: Scalars['DateTime'];
  id: Scalars['String'];
  resource: Scalars['String'];
  start: Scalars['DateTime'];
  title: Scalars['String'];
};

export type EditUserInput = {
  name: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  channel: Channel;
  createdAt: Scalars['DateTime'];
  creator: User;
  end: Scalars['DateTime'];
  id: Scalars['String'];
  resource: Scalars['String'];
  start: Scalars['DateTime'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type EventResponse = {
  __typename?: 'EventResponse';
  errors?: Maybe<Array<CError>>;
  event?: Maybe<Event>;
};

export type EventsResponse = {
  __typename?: 'EventsResponse';
  errors?: Maybe<Array<CError>>;
  events?: Maybe<Array<Event>>;
};

export type Message = {
  __typename?: 'Message';
  body: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  sender: User;
  updatedAt: Scalars['DateTime'];
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  errors?: Maybe<Array<CError>>;
  message?: Maybe<Message>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createChannel: ChannelResponse;
  createEvent: EventResponse;
  createMessage: MessageResponse;
  createTeam: TeamResponse;
  deleteChannel: Scalars['Boolean'];
  deleteEvent: StatusResponse;
  deleteTeam: Scalars['Boolean'];
  deleteUser: StatusResponse;
  editChannel: ChannelResponse;
  editEvent: EventResponse;
  editTeam: TeamResponse;
  editUser: StatusResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
};


export type MutationCreateChannelArgs = {
  members: Array<Scalars['String']>;
  name: Scalars['String'];
  teamId: Scalars['String'];
};


export type MutationCreateEventArgs = {
  args: CreateEventInput;
};


export type MutationCreateMessageArgs = {
  body: Scalars['String'];
  channelId: Scalars['String'];
};


export type MutationCreateTeamArgs = {
  description: Scalars['String'];
  members: Array<Scalars['String']>;
  name: Scalars['String'];
  type: TeamType;
};


export type MutationDeleteChannelArgs = {
  id: Scalars['String'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTeamArgs = {
  id: Scalars['String'];
};


export type MutationEditChannelArgs = {
  channelId: Scalars['String'];
  members: Array<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationEditEventArgs = {
  args: EditEventInput;
};


export type MutationEditTeamArgs = {
  description: Scalars['String'];
  name: Scalars['String'];
  teamId: Scalars['String'];
  type: TeamType;
};


export type MutationEditUserArgs = {
  values: EditUserInput;
};


export type MutationLoginArgs = {
  emailOrName: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type New_Message_Payload = {
  __typename?: 'NEW_MESSAGE_PAYLOAD';
  channelId: Scalars['String'];
  message: Message;
  recievers: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getChannel: ChannelResponse;
  getEvent: EventResponse;
  getEvents: EventsResponse;
  getTeam: TeamResponse;
  getTeams: TeamsResponse;
  me: UserResponse;
  search: SearchResponse;
};


export type QueryGetChannelArgs = {
  id: Scalars['String'];
};


export type QueryGetEventArgs = {
  id: Scalars['String'];
};


export type QueryGetEventsArgs = {
  channelId: Scalars['String'];
};


export type QueryGetTeamArgs = {
  id: Scalars['String'];
};


export type QuerySearchArgs = {
  options: SearchOptions;
};

export type SearchOptions = {
  query: Scalars['String'];
  type: SearchType;
};

export type SearchResponse = {
  __typename?: 'SearchResponse';
  errors?: Maybe<Array<CError>>;
  teams?: Maybe<Array<Team>>;
  users?: Maybe<Array<User>>;
};

export enum SearchType {
  Team = 'TEAM',
  User = 'USER',
  UserTeam = 'USER_TEAM'
}

export type StatusResponse = {
  __typename?: 'StatusResponse';
  errors?: Maybe<Array<CError>>;
  status: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: New_Message_Payload;
};

export type Team = {
  __typename?: 'Team';
  channels: Array<Channel>;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['String'];
  isOwner: Scalars['Boolean'];
  name: Scalars['String'];
  type: TeamType;
  updatedAt: Scalars['DateTime'];
};

export type TeamResponse = {
  __typename?: 'TeamResponse';
  errors?: Maybe<Array<CError>>;
  team?: Maybe<Team>;
};

export enum TeamType {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type TeamsResponse = {
  __typename?: 'TeamsResponse';
  errors?: Maybe<Array<CError>>;
  teams?: Maybe<Array<Team>>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<CError>>;
  user?: Maybe<User>;
};

export type FChannelFragment = { __typename?: 'Channel', id: string, name: string, owners: Array<string>, createdAt: any, members: Array<{ __typename?: 'User', id: string, name: string }> };

export type FErrorFragment = { __typename?: 'CError', property: string, message: string };

export type FEventFragment = { __typename?: 'Event', id: string, title: string, start: any, end: any, resource: string };

export type FMessageFragment = { __typename?: 'Message', id: string, body: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any } };

export type FStatusResponseFragment = { __typename?: 'StatusResponse', status: boolean, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null };

export type FTeamFragment = { __typename?: 'Team', id: string, name: string, description: string, createdAt: any, type: TeamType, isOwner: boolean, channels: Array<{ __typename?: 'Channel', id: string, name: string, owners: Array<string>, createdAt: any, members: Array<{ __typename?: 'User', id: string, name: string }> }> };

export type FUserFragment = { __typename?: 'User', id: string, name: string, email: string, createdAt: any };

export type CreateChannelMutationVariables = Exact<{
  name: Scalars['String'];
  members: Array<Scalars['String']> | Scalars['String'];
  teamId: Scalars['String'];
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel: { __typename?: 'ChannelResponse', channel?: { __typename?: 'Channel', id: string, name: string, owners: Array<string>, createdAt: any, members: Array<{ __typename?: 'User', id: string, name: string }> } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type CreateEventMutationVariables = Exact<{
  args: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'EventResponse', event?: { __typename?: 'Event', id: string, title: string, start: any, end: any, resource: string, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any } } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type CreateMessageMutationVariables = Exact<{
  channelId: Scalars['String'];
  body: Scalars['String'];
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'MessageResponse', message?: { __typename?: 'Message', id: string, body: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any } } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type CreateTeamMutationVariables = Exact<{
  name: Scalars['String'];
  members: Array<Scalars['String']> | Scalars['String'];
  description: Scalars['String'];
  type: TeamType;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'TeamResponse', team?: { __typename?: 'Team', id: string, name: string, description: string, createdAt: any, type: TeamType, isOwner: boolean, channels: Array<{ __typename?: 'Channel', id: string, name: string, owners: Array<string>, createdAt: any, members: Array<{ __typename?: 'User', id: string, name: string }> }> } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type DeleteChannelMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteChannelMutation = { __typename?: 'Mutation', deleteChannel: boolean };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: { __typename?: 'StatusResponse', status: boolean, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type DeleteTeamMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTeamMutation = { __typename?: 'Mutation', deleteTeam: boolean };

export type DeleteUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'StatusResponse', status: boolean, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type EditChannelMutationVariables = Exact<{
  name: Scalars['String'];
  members: Array<Scalars['String']> | Scalars['String'];
  channelId: Scalars['String'];
}>;


export type EditChannelMutation = { __typename?: 'Mutation', editChannel: { __typename?: 'ChannelResponse', channel?: { __typename?: 'Channel', id: string, name: string, owners: Array<string>, createdAt: any, members: Array<{ __typename?: 'User', id: string, name: string }> } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type EditEventMutationVariables = Exact<{
  args: EditEventInput;
}>;


export type EditEventMutation = { __typename?: 'Mutation', editEvent: { __typename?: 'EventResponse', event?: { __typename?: 'Event', id: string, title: string, start: any, end: any, resource: string } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type EditTeamMutationVariables = Exact<{
  teamId: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  type: TeamType;
}>;


export type EditTeamMutation = { __typename?: 'Mutation', editTeam: { __typename?: 'TeamResponse', team?: { __typename?: 'Team', name: string, description: string, type: TeamType } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type EditUserMutationVariables = Exact<{
  values: EditUserInput;
}>;


export type EditUserMutation = { __typename?: 'Mutation', editUser: { __typename?: 'StatusResponse', status: boolean, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type LoginMutationVariables = Exact<{
  emailOrName: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, name: string, email: string, createdAt: any } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, name: string, email: string, createdAt: any } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type GetChannelQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetChannelQuery = { __typename?: 'Query', getChannel: { __typename?: 'ChannelResponse', channel?: { __typename?: 'Channel', id: string, name: string, owners: Array<string>, createdAt: any, messages: Array<{ __typename?: 'Message', id: string, body: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any } }>, events: Array<{ __typename?: 'Event', id: string, title: string, start: any, end: any, resource: string, creator: { __typename?: 'User', id: string, name: string, email: string, createdAt: any } }>, team: { __typename?: 'Team', id: string, name: string }, members: Array<{ __typename?: 'User', id: string, name: string }> } | null } };

export type GetEventQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetEventQuery = { __typename?: 'Query', getEvent: { __typename?: 'EventResponse', event?: { __typename?: 'Event', id: string, title: string, start: any, end: any, resource: string, creator: { __typename?: 'User', id: string, name: string } } | null } };

export type GetTeamQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetTeamQuery = { __typename?: 'Query', getTeam: { __typename?: 'TeamResponse', team?: { __typename?: 'Team', id: string, name: string, description: string, createdAt: any, type: TeamType, isOwner: boolean, channels: Array<{ __typename?: 'Channel', id: string, name: string, owners: Array<string>, createdAt: any, members: Array<{ __typename?: 'User', id: string, name: string }> }> } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type GetTeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeamsQuery = { __typename?: 'Query', getTeams: { __typename?: 'TeamsResponse', teams?: Array<{ __typename?: 'Team', id: string, name: string, isOwner: boolean, channels: Array<{ __typename?: 'Channel', id: string, name: string, events: Array<{ __typename?: 'Event', id: string, title: string, start: any, end: any, resource: string }> }> }> | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, name: string, email: string, createdAt: any } | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type SearchQueryVariables = Exact<{
  options: SearchOptions;
}>;


export type SearchQuery = { __typename?: 'Query', search: { __typename?: 'SearchResponse', users?: Array<{ __typename?: 'User', id: string, name: string }> | null, teams?: Array<{ __typename?: 'Team', id: string, name: string }> | null, errors?: Array<{ __typename?: 'CError', property: string, message: string }> | null } };

export type NewMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMessageSubscription = { __typename?: 'Subscription', newMessage: { __typename?: 'NEW_MESSAGE_PAYLOAD', channelId: string, message: { __typename?: 'Message', id: string, body: string, createdAt: any, sender: { __typename?: 'User', id: string, name: string, email: string, createdAt: any } } } };

export const FEventFragmentDoc = gql`
    fragment FEvent on Event {
  id
  title
  start
  end
  resource
}
    `;
export const FUserFragmentDoc = gql`
    fragment FUser on User {
  id
  name
  email
  createdAt
}
    `;
export const FMessageFragmentDoc = gql`
    fragment FMessage on Message {
  id
  body
  createdAt
  sender {
    ...FUser
  }
}
    ${FUserFragmentDoc}`;
export const FErrorFragmentDoc = gql`
    fragment FError on CError {
  property
  message
}
    `;
export const FStatusResponseFragmentDoc = gql`
    fragment FStatusResponse on StatusResponse {
  status
  errors {
    ...FError
  }
}
    ${FErrorFragmentDoc}`;
export const FChannelFragmentDoc = gql`
    fragment FChannel on Channel {
  id
  name
  owners
  createdAt
  members {
    id
    name
  }
}
    `;
export const FTeamFragmentDoc = gql`
    fragment FTeam on Team {
  id
  name
  description
  createdAt
  type
  isOwner
  channels {
    ...FChannel
  }
}
    ${FChannelFragmentDoc}`;
export const CreateChannelDocument = gql`
    mutation CreateChannel($name: String!, $members: [String!]!, $teamId: String!) {
  createChannel(name: $name, members: $members, teamId: $teamId) {
    channel {
      ...FChannel
    }
    errors {
      ...FError
    }
  }
}
    ${FChannelFragmentDoc}
${FErrorFragmentDoc}`;
export type CreateChannelMutationFn = Apollo.MutationFunction<CreateChannelMutation, CreateChannelMutationVariables>;

/**
 * __useCreateChannelMutation__
 *
 * To run a mutation, you first call `useCreateChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChannelMutation, { data, loading, error }] = useCreateChannelMutation({
 *   variables: {
 *      name: // value for 'name'
 *      members: // value for 'members'
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useCreateChannelMutation(baseOptions?: Apollo.MutationHookOptions<CreateChannelMutation, CreateChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, options);
      }
export type CreateChannelMutationHookResult = ReturnType<typeof useCreateChannelMutation>;
export type CreateChannelMutationResult = Apollo.MutationResult<CreateChannelMutation>;
export type CreateChannelMutationOptions = Apollo.BaseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables>;
export const CreateEventDocument = gql`
    mutation CreateEvent($args: CreateEventInput!) {
  createEvent(args: $args) {
    event {
      ...FEvent
      creator {
        ...FUser
      }
    }
    errors {
      ...FError
    }
  }
}
    ${FEventFragmentDoc}
${FUserFragmentDoc}
${FErrorFragmentDoc}`;
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, options);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($channelId: String!, $body: String!) {
  createMessage(channelId: $channelId, body: $body) {
    message {
      ...FMessage
    }
    errors {
      ...FError
    }
  }
}
    ${FMessageFragmentDoc}
${FErrorFragmentDoc}`;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const CreateTeamDocument = gql`
    mutation CreateTeam($name: String!, $members: [String!]!, $description: String!, $type: TeamType!) {
  createTeam(
    name: $name
    members: $members
    description: $description
    type: $type
  ) {
    team {
      ...FTeam
    }
    errors {
      ...FError
    }
  }
}
    ${FTeamFragmentDoc}
${FErrorFragmentDoc}`;
export type CreateTeamMutationFn = Apollo.MutationFunction<CreateTeamMutation, CreateTeamMutationVariables>;

/**
 * __useCreateTeamMutation__
 *
 * To run a mutation, you first call `useCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMutation, { data, loading, error }] = useCreateTeamMutation({
 *   variables: {
 *      name: // value for 'name'
 *      members: // value for 'members'
 *      description: // value for 'description'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useCreateTeamMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(CreateTeamDocument, options);
      }
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>;
export type CreateTeamMutationResult = Apollo.MutationResult<CreateTeamMutation>;
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<CreateTeamMutation, CreateTeamMutationVariables>;
export const DeleteChannelDocument = gql`
    mutation DeleteChannel($id: String!) {
  deleteChannel(id: $id)
}
    `;
export type DeleteChannelMutationFn = Apollo.MutationFunction<DeleteChannelMutation, DeleteChannelMutationVariables>;

/**
 * __useDeleteChannelMutation__
 *
 * To run a mutation, you first call `useDeleteChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChannelMutation, { data, loading, error }] = useDeleteChannelMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteChannelMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChannelMutation, DeleteChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChannelMutation, DeleteChannelMutationVariables>(DeleteChannelDocument, options);
      }
export type DeleteChannelMutationHookResult = ReturnType<typeof useDeleteChannelMutation>;
export type DeleteChannelMutationResult = Apollo.MutationResult<DeleteChannelMutation>;
export type DeleteChannelMutationOptions = Apollo.BaseMutationOptions<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const DeleteEventDocument = gql`
    mutation DeleteEvent($id: String!) {
  deleteEvent(id: $id) {
    ...FStatusResponse
  }
}
    ${FStatusResponseFragmentDoc}`;
export type DeleteEventMutationFn = Apollo.MutationFunction<DeleteEventMutation, DeleteEventMutationVariables>;

/**
 * __useDeleteEventMutation__
 *
 * To run a mutation, you first call `useDeleteEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventMutation, { data, loading, error }] = useDeleteEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEventMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventMutation, DeleteEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEventMutation, DeleteEventMutationVariables>(DeleteEventDocument, options);
      }
export type DeleteEventMutationHookResult = ReturnType<typeof useDeleteEventMutation>;
export type DeleteEventMutationResult = Apollo.MutationResult<DeleteEventMutation>;
export type DeleteEventMutationOptions = Apollo.BaseMutationOptions<DeleteEventMutation, DeleteEventMutationVariables>;
export const DeleteTeamDocument = gql`
    mutation DeleteTeam($id: String!) {
  deleteTeam(id: $id)
}
    `;
export type DeleteTeamMutationFn = Apollo.MutationFunction<DeleteTeamMutation, DeleteTeamMutationVariables>;

/**
 * __useDeleteTeamMutation__
 *
 * To run a mutation, you first call `useDeleteTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamMutation, { data, loading, error }] = useDeleteTeamMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTeamMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTeamMutation, DeleteTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(DeleteTeamDocument, options);
      }
export type DeleteTeamMutationHookResult = ReturnType<typeof useDeleteTeamMutation>;
export type DeleteTeamMutationResult = Apollo.MutationResult<DeleteTeamMutation>;
export type DeleteTeamMutationOptions = Apollo.BaseMutationOptions<DeleteTeamMutation, DeleteTeamMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser {
  deleteUser {
    ...FStatusResponse
  }
}
    ${FStatusResponseFragmentDoc}`;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const EditChannelDocument = gql`
    mutation EditChannel($name: String!, $members: [String!]!, $channelId: String!) {
  editChannel(name: $name, members: $members, channelId: $channelId) {
    channel {
      ...FChannel
    }
    errors {
      ...FError
    }
  }
}
    ${FChannelFragmentDoc}
${FErrorFragmentDoc}`;
export type EditChannelMutationFn = Apollo.MutationFunction<EditChannelMutation, EditChannelMutationVariables>;

/**
 * __useEditChannelMutation__
 *
 * To run a mutation, you first call `useEditChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editChannelMutation, { data, loading, error }] = useEditChannelMutation({
 *   variables: {
 *      name: // value for 'name'
 *      members: // value for 'members'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useEditChannelMutation(baseOptions?: Apollo.MutationHookOptions<EditChannelMutation, EditChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditChannelMutation, EditChannelMutationVariables>(EditChannelDocument, options);
      }
export type EditChannelMutationHookResult = ReturnType<typeof useEditChannelMutation>;
export type EditChannelMutationResult = Apollo.MutationResult<EditChannelMutation>;
export type EditChannelMutationOptions = Apollo.BaseMutationOptions<EditChannelMutation, EditChannelMutationVariables>;
export const EditEventDocument = gql`
    mutation EditEvent($args: EditEventInput!) {
  editEvent(args: $args) {
    event {
      ...FEvent
    }
    errors {
      ...FError
    }
  }
}
    ${FEventFragmentDoc}
${FErrorFragmentDoc}`;
export type EditEventMutationFn = Apollo.MutationFunction<EditEventMutation, EditEventMutationVariables>;

/**
 * __useEditEventMutation__
 *
 * To run a mutation, you first call `useEditEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editEventMutation, { data, loading, error }] = useEditEventMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useEditEventMutation(baseOptions?: Apollo.MutationHookOptions<EditEventMutation, EditEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditEventMutation, EditEventMutationVariables>(EditEventDocument, options);
      }
export type EditEventMutationHookResult = ReturnType<typeof useEditEventMutation>;
export type EditEventMutationResult = Apollo.MutationResult<EditEventMutation>;
export type EditEventMutationOptions = Apollo.BaseMutationOptions<EditEventMutation, EditEventMutationVariables>;
export const EditTeamDocument = gql`
    mutation EditTeam($teamId: String!, $name: String!, $description: String!, $type: TeamType!) {
  editTeam(teamId: $teamId, name: $name, description: $description, type: $type) {
    team {
      name
      description
      type
    }
    errors {
      ...FError
    }
  }
}
    ${FErrorFragmentDoc}`;
export type EditTeamMutationFn = Apollo.MutationFunction<EditTeamMutation, EditTeamMutationVariables>;

/**
 * __useEditTeamMutation__
 *
 * To run a mutation, you first call `useEditTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editTeamMutation, { data, loading, error }] = useEditTeamMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useEditTeamMutation(baseOptions?: Apollo.MutationHookOptions<EditTeamMutation, EditTeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditTeamMutation, EditTeamMutationVariables>(EditTeamDocument, options);
      }
export type EditTeamMutationHookResult = ReturnType<typeof useEditTeamMutation>;
export type EditTeamMutationResult = Apollo.MutationResult<EditTeamMutation>;
export type EditTeamMutationOptions = Apollo.BaseMutationOptions<EditTeamMutation, EditTeamMutationVariables>;
export const EditUserDocument = gql`
    mutation EditUser($values: EditUserInput!) {
  editUser(values: $values) {
    ...FStatusResponse
  }
}
    ${FStatusResponseFragmentDoc}`;
export type EditUserMutationFn = Apollo.MutationFunction<EditUserMutation, EditUserMutationVariables>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useEditUserMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, options);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const LoginDocument = gql`
    mutation Login($emailOrName: String!, $password: String!) {
  login(emailOrName: $emailOrName, password: $password) {
    user {
      ...FUser
    }
    errors {
      ...FError
    }
  }
}
    ${FUserFragmentDoc}
${FErrorFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      emailOrName: // value for 'emailOrName'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    user {
      ...FUser
    }
    errors {
      ...FError
    }
  }
}
    ${FUserFragmentDoc}
${FErrorFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const GetChannelDocument = gql`
    query GetChannel($id: String!) {
  getChannel(id: $id) {
    channel {
      ...FChannel
      messages {
        ...FMessage
      }
      events {
        ...FEvent
        creator {
          ...FUser
        }
      }
      team {
        id
        name
      }
    }
  }
}
    ${FChannelFragmentDoc}
${FMessageFragmentDoc}
${FEventFragmentDoc}
${FUserFragmentDoc}`;

/**
 * __useGetChannelQuery__
 *
 * To run a query within a React component, call `useGetChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChannelQuery(baseOptions: Apollo.QueryHookOptions<GetChannelQuery, GetChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, options);
      }
export function useGetChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChannelQuery, GetChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, options);
        }
export type GetChannelQueryHookResult = ReturnType<typeof useGetChannelQuery>;
export type GetChannelLazyQueryHookResult = ReturnType<typeof useGetChannelLazyQuery>;
export type GetChannelQueryResult = Apollo.QueryResult<GetChannelQuery, GetChannelQueryVariables>;
export const GetEventDocument = gql`
    query GetEvent($id: String!) {
  getEvent(id: $id) {
    event {
      ...FEvent
      creator {
        id
        name
      }
    }
  }
}
    ${FEventFragmentDoc}`;

/**
 * __useGetEventQuery__
 *
 * To run a query within a React component, call `useGetEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEventQuery(baseOptions: Apollo.QueryHookOptions<GetEventQuery, GetEventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEventQuery, GetEventQueryVariables>(GetEventDocument, options);
      }
export function useGetEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEventQuery, GetEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEventQuery, GetEventQueryVariables>(GetEventDocument, options);
        }
export type GetEventQueryHookResult = ReturnType<typeof useGetEventQuery>;
export type GetEventLazyQueryHookResult = ReturnType<typeof useGetEventLazyQuery>;
export type GetEventQueryResult = Apollo.QueryResult<GetEventQuery, GetEventQueryVariables>;
export const GetTeamDocument = gql`
    query GetTeam($id: String!) {
  getTeam(id: $id) {
    team {
      ...FTeam
    }
    errors {
      ...FError
    }
  }
}
    ${FTeamFragmentDoc}
${FErrorFragmentDoc}`;

/**
 * __useGetTeamQuery__
 *
 * To run a query within a React component, call `useGetTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTeamQuery(baseOptions: Apollo.QueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
      }
export function useGetTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, options);
        }
export type GetTeamQueryHookResult = ReturnType<typeof useGetTeamQuery>;
export type GetTeamLazyQueryHookResult = ReturnType<typeof useGetTeamLazyQuery>;
export type GetTeamQueryResult = Apollo.QueryResult<GetTeamQuery, GetTeamQueryVariables>;
export const GetTeamsDocument = gql`
    query GetTeams {
  getTeams {
    teams {
      id
      name
      isOwner
      channels {
        id
        name
        events {
          ...FEvent
        }
      }
    }
    errors {
      ...FError
    }
  }
}
    ${FEventFragmentDoc}
${FErrorFragmentDoc}`;

/**
 * __useGetTeamsQuery__
 *
 * To run a query within a React component, call `useGetTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTeamsQuery(baseOptions?: Apollo.QueryHookOptions<GetTeamsQuery, GetTeamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamsQuery, GetTeamsQueryVariables>(GetTeamsDocument, options);
      }
export function useGetTeamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamsQuery, GetTeamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamsQuery, GetTeamsQueryVariables>(GetTeamsDocument, options);
        }
export type GetTeamsQueryHookResult = ReturnType<typeof useGetTeamsQuery>;
export type GetTeamsLazyQueryHookResult = ReturnType<typeof useGetTeamsLazyQuery>;
export type GetTeamsQueryResult = Apollo.QueryResult<GetTeamsQuery, GetTeamsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    user {
      ...FUser
    }
    errors {
      ...FError
    }
  }
}
    ${FUserFragmentDoc}
${FErrorFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const SearchDocument = gql`
    query Search($options: SearchOptions!) {
  search(options: $options) {
    users {
      id
      name
    }
    teams {
      id
      name
    }
    errors {
      ...FError
    }
  }
}
    ${FErrorFragmentDoc}`;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const NewMessageDocument = gql`
    subscription NewMessage {
  newMessage {
    message {
      ...FMessage
    }
    channelId
  }
}
    ${FMessageFragmentDoc}`;

/**
 * __useNewMessageSubscription__
 *
 * To run a query within a React component, call `useNewMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewMessageSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewMessageSubscription, NewMessageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewMessageSubscription, NewMessageSubscriptionVariables>(NewMessageDocument, options);
      }
export type NewMessageSubscriptionHookResult = ReturnType<typeof useNewMessageSubscription>;
export type NewMessageSubscriptionResult = Apollo.SubscriptionResult<NewMessageSubscription>;