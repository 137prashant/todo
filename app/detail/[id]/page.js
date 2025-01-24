"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications
import { use } from "react";
import { useAuth } from "@/auth/authContext";
import NavBar from "@/app/component/NavBar";
export default function Page() {
  const { isAuthenticated } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [ttId, setTtId] = useState(null);
  // Fetch task details by id
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // If not authenticated, show nothing (or you can show a loading screen)
  if (!isAuthenticated) return null;
  const getToDoTaskDetail = async (taskId) => {
    if (!taskId) return;

    const url = `https://todos-api-aeaf.onrender.com/api/v1/todo/getById?id=${taskId}`;
    const token = Cookies.get("token"); // Get token from cookies, make sure it's set

    if (!token) {
      toast.error("You need to log in first");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.msg || "Failed to fetch task details");
      } else {
        setTask(data); // Assuming the response contains task data
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Extract the ID from the URL using window.location.pathname
    const path = window.location.pathname; // Get the full URL path
    const id = path.split("/").pop(); // Get the last part of the path (id)

    if (id) {
      setTtId(id);
      getToDoTaskDetail(id); // Fetch task details with the extracted id
    }
  }, []); // Ensure the effect runs when 'id' changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-primary">No Task Found</span>
      </div>
    );
  }
  return (
    <>
      <NavBar />
      <div className="hero bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen">
  <div className="hero-content flex flex-col items-center lg:items-start text-center lg:text-left px-6 lg:px-20 py-10 space-y-6 lg:space-y-8">
    {/* Content Section */}
    <div className="w-full max-w-2xl">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">{task.name}</h1>
      
      {/* Status Section */}
      <div className="flex items-center gap-3 mt-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            task.status
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {task.status ? "Completed" : "To-Do"}
        </span>
        <div className="badge badge-accent badge-outline">
          {task.status ? "Status: Completed" : "Status: To-Do"}
        </div>
      </div>

      <p className="text-lg text-gray-600 mt-4">{task.description}</p>

      {/* Divider */}
      <div className="border-t-2 border-gray-300 my-6"></div>

      {/* Additional Static Section */}
      {/* <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Why This Task Matters
        </h2>
        <p className="text-gray-600 text-sm">
          Managing your tasks efficiently is the first step towards productivity.
          Use this task as a way to prioritize and keep track of your goals.
        </p>
      </div> */}

      {/* Buttons */}
      <div className="flex justify-between flex-wrap gap-4   mt-6">
        <button
          className="btn btn-primary"
          onClick={() => router.push(`/tasks`)}
        >
          Back
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => router.push(`/update/${ttId}`)}
        >
          Update Task
        </button>
      </div>
    </div>
  </div>
</div>
    </>
  );
}
