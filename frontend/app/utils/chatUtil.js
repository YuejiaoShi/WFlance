import { toast } from 'react-toastify';
import { defaultSuccessCallback, handleResponse, sendGetRequest } from './resHandler';

export const getAllMessagesFromDeveloper = async developerId => {
  const response = await sendGetRequest(`/api/chat/history/${developerId}`);
  return handleResponse(response, defaultSuccessCallback, () => {
    toast.error('Failed to fetch clients');
  });
};

export const getClientNames = async (clientIds, userId) => {
  const clientPromises = clientIds.map(async client => {
    const response = await fetch(`/api/users/${client.id}`);
    const result = await handleResponse(response, defaultSuccessCallback, () => {});
    if (result && result.id && result.name) {
      return { id: result.id, name: result.name };
    }
    return null;
  });

  const clients = await Promise.all(clientPromises);
  const filteredClients = clients.filter(
    client => client !== null && client !== undefined && client.id !== Number(userId)
  );

  return filteredClients;
};

export const getClientNameById = async clientId => {
  const response = await sendGetRequest(`/api/users/${clientId}`);
  const result = await handleResponse(response, defaultSuccessCallback, () => {});
  if (result && result.name) {
    return result.name;
  }
  return 'Unknown Client';
};
