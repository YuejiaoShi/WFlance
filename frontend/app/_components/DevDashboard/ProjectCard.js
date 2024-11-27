import { getFieldFromCookie } from '@/app/utils/auth';
import { getAllProjectsFromDeveloper } from '@/app/utils/projectUtil';
import React, { useEffect, useState } from 'react';
import { formatProjectData } from './helpers';
import Link from 'next/link';

export default function ProjectCard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = getFieldFromCookie('userId');

      const allProjects = await getAllProjectsFromDeveloper(userId);

      if (Array.isArray(allProjects)) {
        setProjects(allProjects.slice(0, 4));
      } else {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className='p-4 border h-64 overflow-y-auto flex flex-col items-center bg-white shadow-lg rounded-lg md:p-4 cursor-pointer  transition-all duration-300  hover:bg-gray-50'>
      <h2 className='text-lg font-semibold mb-4 text-gray-800'>Your Projects</h2>

      {projects.length > 0 ? (
        <ul>
          {projects.map(project => {
            const formattedProject = formatProjectData(project);
            return (
              <li key={formattedProject.id} className='border-b text-sm py-2'>
                <Link
                  href={`/dev-dashboard/projects/${formattedProject.id}`}
                  className='text-blue-500 hover:text-blue-700'
                >
                  {project.projects.title}
                </Link>
              </li>
            );
          })}
          <li className='text-gray-700 text-center'>...</li>
        </ul>
      ) : (
        <p className='text-sm text-gray-500'>No projects found.</p>
      )}
    </div>
  );
}
