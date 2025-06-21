import { cn } from "@/lib/utils";

import { cva } from "class-variance-authority";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MessageLoading from "./message-loading";

const chatBubbleVariant = cva("flex gap-2 max-w-[60%] items-end relative group", {
  variants: {
    variant: {
      received: "self-start",
      sent: "self-end flex-row-reverse",
    },
    layout: {
      default: "",
      ai: "max-w-full w-full items-center",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

const ChatBubble = React.forwardRef(({ className, variant, layout, children, ...props }, ref) => (
  <div className={cn(chatBubbleVariant({ variant, layout, className }), "relative group")} ref={ref} {...props}>
    {React.Children.map(children, (child) =>
      React.isValidElement(child) && typeof child.type !== "string"
        ? React.cloneElement(child, {
            variant,
            layout,
          })
        : child
    )}
  </div>
));
ChatBubble.displayName = "ChatBubble";

const chatBubbleMessageVariants = cva("p-4", {
  variants: {
    variant: {
      received: "bg-secondary text-secondary-foreground rounded-r-lg rounded-tl-lg",
      sent: "bg-[#71d4ab] text-secondary-foreground rounded-l-lg rounded-tr-lg",
    },
    layout: {
      default: "",
      ai: "border-t w-full rounded-none bg-transparent",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

const ChatBubbleMessage = React.forwardRef(
  ({ className, variant, layout, isLoading = false, children, ...props }, ref) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        "break-words max-w-full whitespace-pre-wrap"
      )}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  )
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

const ChatBubbleAvatar = ({ src, fallback, className }) => (
  <Avatar className={className}>
    <AvatarImage src={src} alt="Avatar" />
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
);

export { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage };
