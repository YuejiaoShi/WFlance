import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Laptop, Globe, Rocket, BoxSelect } from "lucide-react";
import { useRouter } from "next/navigation";
const ProjectsList = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "outline";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getProjectIcon = (type) => {
    const iconMap = {
      web: <Globe className="w-6 h-6 text-blue-500" />,
      mobile: <Laptop className="w-6 h-6 text-green-500" />,
      startup: <Rocket className="w-6 h-6 text-purple-500" />,
      design: <BoxSelect className="w-6 h-6 text-pink-500" />,
    };
    return iconMap[type] || <Rocket className="w-6 h-6 text-gray-500" />;
  };

  const handleApplyToProject = (project) => {
    setSelectedProject(project);
    console.log(`Applying to project ${project.id}`);
  };

  // Calculate pagination values
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center h-64"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-2xl font-bold text-primary"
        >
          Loading Projects...
        </motion.div>
      </motion.div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-center p-8"
      >
        Error: {error}
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-4">
            <Rocket className="w-8 h-8 text-primary" />
            <span>Available Projects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            <div className="space-y-4">
              {currentProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  whileHover={{
                    scale: 1.025,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                  }}
                  className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-accent/10 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    {getProjectIcon(project.type)}
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getStatusBadgeVariant(project.status)}>
                          {project.status}
                        </Badge>
                        {project.tags &&
                          project.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    onClick={() => handleApplyToProject(project)}
                    className="ml-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <motion.div whileTap={{ scale: 0.95 }}>
                      Take on Project
                    </motion.div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          <div className="flex justify-between items-center mt-4">
            <Button disabled={currentPage === 1} onClick={handlePreviousPage}>
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optional Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">
                {selectedProject.title}
              </h2>
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                Access Denied
              </h2>
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 rounded-full p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                    />
                  </svg>
                </div>
              </div>

              <p className="mb-6 text-center text-gray-700">
                Please register first to gain access and start taking on
                projects.
              </p>
              <Button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                onClick={() => router.push("/signup")}
              >
                Register Now
              </Button>
              <Button
                onClick={() => setSelectedProject(null)}
                className="w-full"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectsList;
