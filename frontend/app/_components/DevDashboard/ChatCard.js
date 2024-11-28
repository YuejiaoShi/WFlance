import { getFieldFromCookie } from '@/app/utils/auth';
import { useEffect, useState } from 'react';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { getAllProjectsFromDeveloper } from '@/app/utils/projectUtil';

function extractClientNames(data) {
  return data
    .filter((item, index, self) => {
      const clientName = item.projects?.client?.name;
      return clientName && self.findIndex(i => i.projects?.client?.name === clientName) === index;
    })
    .map(item => item.projects.client.name);
}

export default function ChatCard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = getFieldFromCookie('userId');

      const allProject = await getAllProjectsFromDeveloper(userId);
      const allClients = extractClientNames(allProject);

      if (allClients.length === 0) setClients([]);
      setClients(allClients.slice(0, 4));
    };
    fetchProjects();
  }, []);

  return (
    <div className='p-4 border h-64 overflow-y-auto flex flex-col items-center bg-white shadow-lg rounded-lg md:p-4 cursor-pointer transition-all duration-300  hover:bg-gray-50'>
      <h2 className='text-lg font-semibold mb-4 text-gray-800'>Chat with Your Clients</h2>
      <div className='flex flex-row items-center gap-x-6 justify-center'>
        <div className='w-14 h-14 bg-neutral-light rounded-3xl flex items-center justify-center text-3xl'>👤</div>
        <ForumOutlinedIcon className='text-primary-blue text-2xl' />
        {clients.length > 0 ? (
          <ul>
            {clients.map((client, index) => (
              <li key={index} className='border-b text-sm py-2 text-primary-blue'>
                {client || `User ${client.id}`}
              </li>
            ))}

            <li className='text-gray-700 text-center'>...</li>
          </ul>
        ) : (
          <p className='text-sm text-gray-500'>No client.</p>
        )}
      </div>
    </div>
  );
}
