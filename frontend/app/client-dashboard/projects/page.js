"use client";
import { useState, useEffect } from "react";
import ProjectClient from "@/app/_components/client-dashboard-components/ProjectClient";
import Spinner from "@/app/_components/client-dashboard-components/Spinner";

// export const metadata = {
//   title: "projects",
// };

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();

          setUserName(userData.name);
          setUserId(userData.id);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        setError(
          "Error fetching user data: " + error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `/api/projects/client/${userId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const projectData = await response.json();
          setProjects(projectData);
        } else {
          setError(
            `Failed to fetch projects: ${response.statusText}`
          );
        }
      } catch (error) {
        setError(
          `Error fetching projects: ${error.message}`
        );
      }
    };

    fetchProjects();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        const projectData = await response.json();
        console.log(projectData);
        setProjects((prevProjects) =>
          prevProjects.filter(
            (project) => project.id !== id
          )
        );
      } else {
        console.error(
          "Failed to delete project:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (projects.length === 0) {
    return <div>You do not have any projects.</div>;
  }

  const statusCounts = {
    completed: projects.filter(
      (p) => p.status === "completed"
    ).length,
    inProgress: projects.filter(
      (p) => p.status === "in-progress"
    ).length,
    pending: projects.filter((p) => p.status === "pending")
      .length,
  };

  return (
    <div className="">
      {isLoading ? (
        <Spinner />
      ) : (
        projects.length > 0 && (
          <div className="flex flex-col">
            {projects.map((project) => (
              <ProjectClient
                key={project.id}
                project={project}
                statusCounts={statusCounts}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
