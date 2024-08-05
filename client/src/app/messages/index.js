import { useEffect, useRef, useState } from "react"

import { useChat } from "context/chat-provider"
import { cn } from "lib/utils"
import ChatContent from "./chat-content"
import ConversationList from "./conversationList"

const MessagePage = () => {
  const { messages } = useChat()
  const chatContentRef = useRef(null)
  const [isContentLayout, setIsContentLayout] = useState(false)

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex">
      <ConversationList
        className={cn(
          isContentLayout ? "hidden" : "flex max-w-full lg:max-w-72  "
        )}
        isContentLayout={isContentLayout}
        onConversationClick={(value) => {
          setIsContentLayout(true)
        }}
      />
      <ChatContent
        className={cn(isContentLayout ? "block" : "hidden lg:block flex-1")}
        ref={chatContentRef}
        onBack={() => setIsContentLayout(false)}
      />
    </div>
  )
}

export default MessagePage
