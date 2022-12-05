import { createContext, useContext, useEffect, useMemo, useState } from "react"
import ChatController from "./chat-controller"
import GroupController from "./group-controller"

// const Context = createContext(new GroupController())

// export function ContextGroup({ children }) {
//   return <Context.Provider>{children}</Context.Provider>
// }

// export function useGroupController() {
//   return useContext(Context)
// }

export const groupController = new GroupController()

/**
 * @type {{
 * loading: boolean
 * groups: import('@t/chat').Group[]
 * }}
 * */
export const defaultGroupState = { loading: false, groups: [] }

export function useGroupChat() {
  const [data, set] = useState(defaultGroupState)

  useEffect(() => {
    groupController.listenGroup(set)
  }, [set])

  return data
}

/**
 * @type {{
 * isLoading: boolean
 * messages: import('@t/chat').Message[]
 * hasMore: boolean
 * }}
 * */
export const defaultChatState = { isLoading: false, messages: [], hasMore: false }

export function useChat() {
  const [data, set] = useState(defaultChatState);
  const controller = useChatController()

  // init
  useEffect(() => {
    controller.listenChange(set)

    controller.refreshChat().then(
      // after get new messages, listen realtime
      () => groupController.listenMessage(controller.group, controller.addMessage)
    )

    // switch to other chat, disconnect here
    return () => groupController.listenMessage(null, null)
  }, [set, controller])

  return data
}

const ChatContext = createContext(/** @type {ChatController} */ (null))

export function ContextChat({ group, children }) {
  const controller = useMemo(() => new ChatController(group), [group])

  return <ChatContext.Provider value={controller}>{children}</ChatContext.Provider>
}

export function useChatController() {
  return useContext(ChatContext)
}
