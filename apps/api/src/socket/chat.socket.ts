import type { Server as SocketIOServer } from "socket.io";
import { Role } from "@prisma/client";
import { sendMessage, getConversationDetail } from "@/modules/chat/chat.service";
import { createNotification } from "@/modules/notifications/notification.service";

export function registerChatSocket(io: SocketIOServer) {
  io.on("connection", (socket) => {
    const userId = (socket as any).user?.id;
    const userRole = (socket as any).user?.role;

    if (!userId) {
      socket.disconnect();
      return;
    }

    // Join user to their personal room for notifications
    socket.join(`user:${userId}`);

    // Join admin room if user is admin
    if (userRole === Role.ADMIN) {
      socket.join("admin-room");
    }

    console.log(`User ${userId} connected to chat`);

    // Handle sending a message
    socket.on(
      "send_message",
      async (data: { conversationId: string; content: string }) => {
        try {
          const message = await sendMessage({
            conversationId: data.conversationId,
            senderId: userId,
            content: data.content,
          });

          // Broadcast message to conversation room
          io
            .to(`conversation:${data.conversationId}`)
            .emit("message_received", {
              messageId: message.messageId,
              conversationId: message.conversationId,
              senderId: message.senderId,
              content: message.content,
              createdAt: message.createdAt,
            });

          // Emit confirmation back to sender
          socket.emit("message_sent", {
            messageId: message.messageId,
            conversationId: message.conversationId,
            senderId: message.senderId,
            content: message.content,
            createdAt: message.createdAt,
          });

          // Create notification
          let notificationTitle = "New message";
          let notificationMessage = "You have a new message";

          if (userRole === Role.CUSTOMER) {
            // Customer sent message to admin
            notificationTitle = "New Customer Message";
            notificationMessage = `Customer sent you a message`;

            await createNotification({
              userId: "admin", // In a multi-admin system, this should be replaced with actual admin user IDs
              type: "CHAT_MESSAGE",
              title: notificationTitle,
              message: notificationMessage,
            });

            // Send notification to admin
            io.to("admin-room").emit("notification", {
              type: "CHAT_MESSAGE",
              title: notificationTitle,
              message: notificationMessage,
            });
          } else if (userRole === Role.ADMIN) {
            // Admin replied to customer
            // Get conversation customer ID
            const conversation = await getConversationDetail(
              data.conversationId,
            );

            if (conversation) {
              notificationTitle = "Seller Replied";
              notificationMessage = "The seller replied to your message";

              await createNotification({
                userId: conversation.customerId,
                type: "CHAT_MESSAGE",
                title: notificationTitle,
                message: notificationMessage,
              });

              // Send notification to customer
              io
                .to(`user:${conversation.customerId}`)
                .emit("notification", {
                  type: "CHAT_MESSAGE",
                  title: notificationTitle,
                  message: notificationMessage,
                });
            }
          }
        } catch (error) {
          socket.emit("error", {
            message:
              error instanceof Error ? error.message : "Failed to send message",
          });
        }
      },
    );

    // Handle joining conversation room
    socket.on("join_conversation", (data: { conversationId: string }) => {
      socket.join(`conversation:${data.conversationId}`);
      console.log(`User ${userId} joined conversation ${data.conversationId}`);
    });

    // Handle leaving conversation room
    socket.on("leave_conversation", (data: { conversationId: string }) => {
      socket.leave(`conversation:${data.conversationId}`);
      console.log(`User ${userId} left conversation ${data.conversationId}`);
    });

    // Handle typing indicator (optional for future use)
    socket.on(
      "typing",
      (data: { conversationId: string; isTyping: boolean }) => {
        socket.to(`conversation:${data.conversationId}`).emit("user_typing", {
          userId,
          isTyping: data.isTyping,
        });
      },
    );

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from chat`);
    });
  });
}
