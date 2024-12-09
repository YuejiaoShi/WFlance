"use client";

import { useEffect, useState } from "react";
import { getFieldFromCookie } from "../utils/auth";
import { getAllProjectsFromDeveloper } from "../utils/projectUtil";
import { useRouter } from "next/navigation";
import DevProjectsList from "../_components/DevDashboard/DevProjectsList";
import BookEvent from "../_components/DevDashboard/BookEvent";
import ProjectCard from "../_components/DevDashboard/ProjectCard";
import ChatCard from "../_components/DevDashboard/ChatCard";

const DevDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = getFieldFromCookie("userId");

      const allProjects = await getAllProjectsFromDeveloper(userId);

      if (Array.isArray(allProjects)) {
        setProjects(allProjects);
      } else {
        setProjects([]);
      }

      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col md:gap-6 gap-4 my-4 p-4 mx-auto max-w-4xl ">
      <div className="flex md:flex-row flex-col gap-4">
        <div
          className="flex-1 hover:shadow-xl"
          onClick={() => router.push("/dev-dashboard/chat")}
        >
          <ChatCard />
        </div>

        <div
          className="flex-1 hover:shadow-xl"
          onClick={() => router.push("/dev-dashboard/projects")}
        >
          <ProjectCard />
        </div>
        <div
          className="flex-1 hover:shadow-xl"
          onClick={() => router.push("/dev-dashboard/calendar")}
        >
          <BookEvent />
        </div>
      </div>

      <DevProjectsList />
    </div>
  );
};

export default DevDashboard;
