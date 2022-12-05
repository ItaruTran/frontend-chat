
export type UUID = string

export interface User {
  id: UUID
  name: string
}

export interface AuthUser extends User {
  token: string
}

export interface AccessToken {
  sub: UUID
  username: string
  iat: number
  exp: number
}

export interface Message {
  id: UUID
  timestamp: Date
  content: string
  attachments?: Attachment[]
  sender_id: UUID
  group_id: number
}

export interface MessageInput {
  content: string
  // attachment?: File[]
  group_id: number
}

export interface Attachment {
  url: string
  messageId: UUID
}

export interface Member {
  member_id: UUID
  group_id: number
  viewed_message_time?: Date
  viewed_message_id?: UUID
  view_message_from?: Date
  created: Date
  modified: Date
}

export interface Group {
  id: number
  name: string
  owner_id: UUID
  friend_id?: UUID
  group_avatar?: string
  last_message_time?: Date
  created: Date
  modified: Date
  members: Member[]
}

export interface GroupInput {
  name: string
  // avatar?: File
  friend_id?: UUID
  members?: UUID[]
}
