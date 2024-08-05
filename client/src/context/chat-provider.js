import { useQuery } from "@tanstack/react-query"
import { useMutate } from "hooks/use-mutate"
import { MUTATE_KEYS, QUERY_KEYS } from "lib/const"
import { createContext, useContext, useEffect, useState } from "react"
import { createQueryList, getRequest, postRequest } from "services/utils"
import { useAuth } from "./auth-provider"
import { useSocket } from "./socket-provider"

const ChatContext = createContext({})

const avatarTemps = [
  "https://images.unsplash.com/photo-1719937206168-f4c829152b91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
  "https://plus.unsplash.com/premium_photo-1721980274417-8d3d99e69ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1722343879466-7dcda68a48cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
  "https://plus.unsplash.com/premium_photo-1722201172121-a36b8ea02866?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8",
]

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const socket = useSocket()

  const [messages, setMessages] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)

  const { data: employees = [] } = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES],
    queryFn: async () => createQueryList("employees")(),
  })

  const {
    data: conversations,
    refetch: refetchConversations,
    isSuccess: fetchConversationsSuccess,
  } = useQuery({
    queryKey: [QUERY_KEYS.CONVERSATIONS],
    queryFn: async () => getRequest(`/conversations/${user?.userId}`),
    select: (data) =>
      data.map((item) => ({
        ...item,
        avatar: avatarTemps[Math.floor(Math.random() * 4)],
      })),
  })

  const { mutate: createConversation, isSuccess } = useMutate({
    invalidateKey: [],
    mutationKey: [MUTATE_KEYS.CONVERSATION, user?.userId],
    mutationFn: async (receiverId, name) => {
      return await postRequest("/conversations", {
        name: name,
        participants: [user?.userId, receiverId],
      })
    },
  })

  useEffect(() => {
    if (
      fetchConversationsSuccess &&
      conversations.length > 0 &&
      !selectedConversation
    ) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations, fetchConversationsSuccess, selectedConversation])

  useEffect(() => {
    if (isSuccess) {
      refetchConversations()
    }
  }, [isSuccess, refetchConversations])

  useEffect(() => {
    if (!socket) return

    socket.on("receiveMessage", (message) => {
      if (message.conversationId === selectedConversation?.id) {
        const newMessage = {
          ...message,
          isUser: message.senderId === user?.userId,
        }
        setMessages((prev) => [...prev, newMessage])
      }
    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [selectedConversation?.id, setMessages, socket, user?.userId])

  const sendMessage = async (newMessage) => {
    if (newMessage.trim() === "") return

    try {
      const message = {
        senderId: user.userId,
        messageContent: newMessage,
      }

      const response = await postRequest(
        `/messages/${selectedConversation?.id}`,
        message
      )

      const newMessageInfo = {
        ...message,
        sentAt: response.sentAt,
        id: response.messageId,
        conversationId: selectedConversation?.id,
      }

      socket.emit("sendMessage", newMessageInfo)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleConversationClick = async (conversation) => {
    setSelectedConversation(conversation)
    try {
      const response = await getRequest(`/messages/${conversation?.id}`)
      if (!response) return
      const formattedMessages = response.map((message) => ({
        ...message,
        isUser: message.senderId === user?.userId,
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error fetching message:", error)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        employees,
        messages,
        setMessages,
        conversations,
        selectedConversation,
        setSelectedConversation,
        handleConversationClick,
        createConversation,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error("useChat mus be used within an ChatProvider")
  }

  return context
}
