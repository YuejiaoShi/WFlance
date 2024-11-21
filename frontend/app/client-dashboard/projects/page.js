"use client";
import { useState, useEffect } from "react";
import ProjectClient from "@/app/_components/client-dashboard-components/ProjectClient";
import Spinner from "@/app/_components/client-dashboard-components/Spinner";
import Link from "next/link";

// export const metadata = {
//   title: "projects",
// };

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
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
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/projects/client/${userId}`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const projectData = await response.json();

          setIsLoading(false);
          setProjects(projectData);
        } else {
          setIsLoading(false);
          setError(
            `Failed to fetch projects: ${response.statusText}`
          );
        }
      } catch (error) {
        setIsLoading(false);
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

  console.log("projects", projects);
  console.log("isLoading", isLoading);
  if (!isLoading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-8 relative z-10 text-center bg-slate-300 ">
        {/* <Spinner /> */}
        <h5 className="text-2xl text-primary-800 mb-10 tracking-tight font-normal">
          You do not have any projects.
        </h5>
        <Link
          href="/client-dashboard/createProject"
          className="bg-accent-500 max-w-fit px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Create project
        </Link>

        <h5 className="text-2xl text-primary-800 mb-10 tracking-tight font-normal">
          to get started.
        </h5>
      </div>
    );
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
