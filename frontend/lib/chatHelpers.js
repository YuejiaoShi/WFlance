export function extractOtherUsers(data, userId) {
  const users = new Set();
  data.forEach(item => {
    if (item.senderId !== userId) users.add(item.senderId);
    if (item.receiverId !== userId) users.add(item.receiverId);
  });
  return Array.from(users);
}

export function groupMessagesByConversation(histories) {
  return histories.reduce((acc, msg) => {
    if (!acc[msg.conversationId]) {
      acc[msg.conversationId] = [];
    }

    acc[msg.conversationId].push({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      message: msg.message,
    });

    return acc;
  }, {});
}

export function getConversationIdFromMessages(allMessages, senderId, receiverId) {
  const conversationId = [senderId, receiverId].sort((a, b) => a - b).join('-');
  const message = allMessages.find(msg => {
    const msgConversationId = [msg.senderId, msg.receiverId].sort((a, b) => a - b).join('-');
    return msgConversationId === conversationId;
  });

  return message ? message.conversationId : null;
}
