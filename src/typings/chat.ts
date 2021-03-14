
export interface FriendList {
  id: number
  user1_id: number
  user1: User
  user2_id: number
  user2: User
}

export interface User {
  id: number
  username: string
}

export interface AccessToken {
  id: string
  created: string
  ttl: number
  userId: number
}

export interface Message {
  id: number
  timestamp: string
  content: string
  attachment_type?: string
  attachment?: string
  sender_id: number
  friendship_id: number
}

export interface MessageInput {
  content: string
  attachment_type?: string
  attachment?: string
  friendship_id: number
}
