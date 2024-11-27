import { FaCalendarAlt } from 'react-icons/fa';

export default function BookEvent() {
  return (
    <div className='p-6 border border-gray-300 h-64 flex flex-col items-center justify-center shadow-lg rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-50 '>
      <div className='mb-4'>
        <FaCalendarAlt className='text-4xl text-primary-blue' />
      </div>
      <h2 className='text-xl font-semibold text-gray-800 mb-2'>Your Calendar</h2>
      <p className='text-sm text-gray-500 text-center'>Book your events and manage your schedule easily.</p>
    </div>
  );
}
