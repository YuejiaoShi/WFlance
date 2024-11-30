import { useRouter } from 'next/navigation';

import { handleLogOut } from '../../utils/auth';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaSignOutAlt } from 'react-icons/fa';

function LogOutButton({}) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        handleLogOut(() => {
          Cookies.remove('userRole', { path: '/' });
          Cookies.remove('userId', { path: '/' });
          Cookies.remove('userName', { path: '/' });
          Cookies.remove('userEmail', { path: '/' });
          Cookies.remove('projectTitle', { path: '/' });

          router.push('/');
          toast.success('Signed out successfully! 🔐');
        });
      }}
      className='px-2 py-1.5 min-w-20 bg-red-500 text-white text-sm rounded hover:bg-red-600'
    >
      <div className='flex items-center space-x-1'>
        <FaSignOutAlt />
        <span>Log Out</span>
      </div>
    </button>
  );
}

export default LogOutButton;
