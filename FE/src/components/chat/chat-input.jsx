import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

const ChatInput = ({ className, ...props }) => {
  return (
    <Textarea
      autoComplete="off"
      name="message"
      className={cn(
        "px-4 py-3 max-h-40 h-full bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center resize-none",
        className
      )}
      {...props}
    />
  );
};
ChatInput.displayName = "ChatInput";

export { ChatInput };
