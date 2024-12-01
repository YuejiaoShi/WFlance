import { defaultSuccessCallback, handleResponse, sendGetRequest } from './resHandler';

export const getAllMessagesFromDeveloper = async developerId => {
  const response = await sendGetRequest(`/api/chat/history/${developerId}`);
  return handleResponse(response, defaultSuccessCallback, () => {
    toast.error('Failed to fetch clients');
  });
};
