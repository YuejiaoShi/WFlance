'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { GoProjectSymlink } from 'react-icons/go';

const TimelineItem = ({ title, date, description, onMilestoneClick, index }) => {
  const colors = [
    '#A085B1', // Soft Lavender
    '#D29E4A', // Muted Golden Yellow
    '#6A8FAD', // Muted Cool Blue
    '#C85F53', // Soft Coral Red
    '#5D8D8B', // Dusty Teal
    '#D69F4C', // Warm, Muted Amber
    '#B15A2E', // Dusty Burnt Orange
    '#6A8C7A', // Muted Sea Green
    '#3D4B59', // Desaturated Navy Blue
    '#7A7F7B', // Muted Slate Gray
  ];

  const color = colors[index % colors.length];

  return (
    <li style={{ borderColor: color }} className='border-l-2'>
      <div className='flex-start flex items-center'>
        <div
          style={{ backgroundColor: color }}
          className='-ml-[9px] -mt-2 flex h-8 w-8 items-center justify-center rounded-full'
        >
          <GoProjectSymlink color='white' className='p-1 h-7 w-7 ' />
        </div>
        <p className='-mt-2 px-3 text-sm text-gray-600'>{date}</p>
      </div>
      <div className=' mt-3 ml-6 pb-12'>
        <h4
          style={{ color }}
          className='text-xl font-semibold hover:underline hover:cursor-pointer'
          onClick={() => onMilestoneClick({ title, date, description })}
        >
          {title}
        </h4>
        <p className='mb-4 mt-2 text-neutral-600 dark:text-neutral-300'>{description}</p>
        <Button
          className='bg-white text-gray-900 border hover:bg-violet-100'
          onClick={() => onMilestoneClick({ title, date, description })}
        >
          Learn More
        </Button>
      </div>
    </li>
  );
};

export default function TimelineDemo() {
  const timelineData = [
    {
      title: 'Title of section 1',
      date: '4 February, 2022',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      title: 'Title of section 2',
      date: '12 January, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    },
    {
      title: 'Title of section 2',
      date: '12 January, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    },
    {
      title: 'Title of section 2',
      date: '12 January, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    },
    {
      title: 'Title of section 2',
      date: '12 January, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    },
    {
      title: 'Title of section 2',
      date: '12 January, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    },
    {
      title: 'Title of section 2',
      date: '12 January, 2022',
      description:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    },
    {
      title: 'Title of section 3',
      date: '27 December, 2021',
      description:
        'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.',
    },
  ];

  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const handleMilestoneClick = milestone => {
    setSelectedMilestone(milestone);
  };

  const closeModal = () => {
    setSelectedMilestone(null);
  };

  return (
    <div className='h-full mx-auto max-w-full flex-grow'>
      <div className='flow-root md:mx-6 mx-3 p-2 mt-4'>
        <ol>
          {timelineData.map((item, index) => (
            <TimelineItem
              key={index}
              index={index}
              title={item.title}
              date={item.date}
              description={item.description}
              onMilestoneClick={handleMilestoneClick}
            />
          ))}
        </ol>

        {selectedMilestone && (
          <div
            className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'
            onClick={closeModal}
          >
            <div
              className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'
              onClick={e => e.stopPropagation()}
            >
              <div className='mt-3 text-center'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>{selectedMilestone.title}</h3>
                <div className='mt-2 px-7 py-3'>
                  <p className='text-sm text-gray-500'>{selectedMilestone.description}</p>
                  <p className='text-sm text-gray-500 mt-2'>{selectedMilestone.date}</p>
                </div>
                <div className='items-center px-4 py-3'>
                  <button
                    id='closeModal'
                    onClick={closeModal}
                    className='px-4 py-2 bg-gray-800 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>{' '}
    </div>
  );
}
