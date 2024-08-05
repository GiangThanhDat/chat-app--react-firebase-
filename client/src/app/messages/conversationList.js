import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select"
import { useChat } from "context/chat-provider"
import { cn } from "lib/utils"
import Conversation from "./conversation"

const ConversationList = ({ onConversationClick, className }) => {
  const {
    messages,
    employees,
    conversations,
    selectedConversation,
    handleConversationClick,
    createConversation,
  } = useChat()

  const lastMessage = messages?.[messages?.length - 1]

  return (
    <div
      className={cn(
        "hidden lg:flex flex-col gap-y-1 max-w-72 w-full pr-3",
        className
      )}
      id="conversations"
    >
      <div className="p-2 py-4">
        <Select
          onValueChange={(value) => {
            createConversation({ receiverId: value.id, name: value.name })
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select user for chat" />
          </SelectTrigger>
          <SelectContent>
            {employees
              ?.filter((employee) =>
                conversations?.some(
                  (conversation) =>
                    !conversation.participants?.some((participant) => {
                      return participant.userId === employee.id
                    })
                )
              )
              ?.map((employee) => (
                <SelectItem key={employee.id} value={employee}>
                  {employee.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      {conversations?.map((conversation) => {
        return (
          <Conversation
            key={conversation.id}
            avatar={conversation.avatar}
            name={conversation.participants[0].userFullName}
            selected={conversation.id === selectedConversation?.id}
            lastMessage={
              lastMessage
                ? lastMessage.messageContent
                : conversation.lastMessage?.messageContent
            }
            senderId={
              lastMessage
                ? lastMessage.senderId
                : conversation.lastMessage?.senderId
            }
            onClick={() => {
              handleConversationClick(conversation)
              onConversationClick()
            }}
          />
        )
      })}
    </div>
  )
}

export default ConversationList
