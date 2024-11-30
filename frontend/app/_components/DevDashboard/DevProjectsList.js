'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Laptop, Globe, Rocket, BoxSelect } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handleAssignProjectToDeveloper } from '@/app/utils/projectUtil';
import { getFieldFromCookie } from '@/app/utils/auth';

const DevProjectsList = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [developerId, setDeveloperId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = getFieldFromCookie('userId');
      setDeveloperId(userId);
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusBadgeVariant = status => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'outline';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getProjectIcon = type => {
    const iconMap = {
      web: <Globe className='w-6 h-6 text-blue-500' />,
      mobile: <Laptop className='w-6 h-6 text-green-500' />,
      startup: <Rocket className='w-6 h-6 text-purple-500' />,
      design: <BoxSelect className='w-6 h-6 text-pink-500' />,
    };
    return iconMap[type] || <Rocket className='w-6 h-6 text-gray-500' />;
  };

  const handleApplyToProject = project => {
    setSelectedProject(project);
    console.log(`Applying to project ${project.id}`);
  };

  // Calculate pagination values
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='flex justify-center items-center h-64'
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='text-2xl font-bold text-primary'
        >
          Loading Projects...
        </motion.div>
      </motion.div>
    );

  if (error)
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-red-500 text-center p-8'>
        Error: {error}
      </motion.div>
    );

  const handleTakeOnProject = () => {
    handleAssignProjectToDeveloper(selectedProject.id, developerId);
    setSelectedProject(null);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-4xl mx-auto'
    >
      <Card className='bg-gray-50 shadow-md rounded-lg'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-4'>
            <Rocket className='w-8 h-8 text-primary' />
            <span className='text-xl font-bold'>Available Projects</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='md:p-4 p-2'>
          <AnimatePresence>
            <div className='space-y-4'>
              {currentProjects.map(project => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  whileHover={{
                    scale: 1.025,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 10,
                  }}
                  className='flex md:flex-row flex-col justify-between p-4 border rounded-lg bg-white hover:bg-gray-100 cursor-pointer'
                >
                  <div className='flex items-center space-x-1 w-full sm:w-auto'>
                    {getProjectIcon(project.type)}
                    <div>
                      <h3 className='md:text-lg text-md font-semibold text-gray-800'>{project.title}</h3>
                      <div className='flex flex-wrap items-center space-x-2 mt-2 mb-2'>
                        <Badge variant={getStatusBadgeVariant(project.status)} className='mb-1'>
                          {project.status}
                        </Badge>
                        {project.budget && (
                          <Badge className='bg-blue-100 text-blue-600 mb-1'>
                            € {Number(project.budget).toFixed(0)}
                          </Badge>
                        )}
                        {project.client && (
                          <Badge className='bg-green-100 text-green-600 mb-1'>{project.client.name}</Badge>
                        )}
                        {project.deadline && (
                          <Badge className='bg-yellow-100 text-yellow-600 mb-1'>{project.deadline} end</Badge>
                        )}
                        {project.tags &&
                          project.tags.map(tag => (
                            <Badge key={tag} variant='outline' className='text-xs text-gray-600 border-gray-300'>
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    onClick={() => handleApplyToProject(project)}
                    className='hover:bg-primary hover:text-white transition-colors px-4 py-2 w-auto sm:w-fit'
                  >
                    <motion.div whileTap={{ scale: 0.95 }}>Take on Project</motion.div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          <div className='flex justify-between items-center mt-4'>
            <Button disabled={currentPage === 1} onClick={handlePreviousPage}>
              Previous
            </Button>
            <span className='text-gray-600'>
              Page {currentPage} of {totalPages}
            </span>
            <Button disabled={currentPage === totalPages} onClick={handleNextPage}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DevProjectsList;
