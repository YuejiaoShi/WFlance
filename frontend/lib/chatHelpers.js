export function extractOtherUsers(data, userId) {
  const users = [];

  data.forEach(item => {
    if (Number(item.senderId) !== Number(userId) && !users.some(user => user.id === item.senderId)) {
      users.push({ id: item.senderId, conversationId: item.conversationId });
    }

    if (Number(item.receiverId) !== Number(userId) && !users.some(user => user.id === item.receiverId)) {
      users.push({ id: item.receiverId, conversationId: item.conversationId });
    }
  });

  return users;
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
