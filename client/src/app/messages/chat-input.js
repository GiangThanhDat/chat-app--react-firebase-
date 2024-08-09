import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover"
import EmojiPicker from "emoji-picker-react"
import { Send, Smile } from "lucide-react"

const ChatInput = ({ value, onChange, onSent }) => {
  return (
    <div className="flex items-center gap-3 ">
      <Input
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSent()
          }
        }}
        placeholder={"Type message ..."}
      />
      <Popover>
        <PopoverTrigger>
          <Smile size={24} />
        </PopoverTrigger>
        <PopoverContent side="top" align="end" alignOffset={10} className="p-0">
          <EmojiPicker
            onEmojiClick={(event) => {
              onChange((prev) => `${prev} ${event.emoji}`)
            }}
          />
        </PopoverContent>
      </Popover>
      {value && (
        <Button
          size="sm"
          className="bg-blue-500 text-white rounded-lg"
          onClick={onSent}
        >
          <Send size={24} />
        </Button>
      )}
    </div>
  )
}

export default ChatInput
