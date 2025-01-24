"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications
import { use } from "react";
import { useAuth } from "@/auth/authContext";
import NavBar from "@/app/component/NavBar";
import { useDispatch } from "react-redux";
import { updateTodo } from "../../redux/todoSlice";
export default function Page() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // If not authenticated, show nothing (or you can show a loading screen)
  if (!isAuthenticated) return null;
  const updateTodoTask = async (id, title, description, status) => {
    const url = `https://todos-api-aeaf.onrender.com/api/v1/todo/update?id=${id}`;
    const token = Cookies.get("token"); // Get the token from cookies

    if (!token) {
      toast.error("You need to log in first");
      router.push("/login");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    };
    const updatedData = {
      name: title,
      description: description,
      status: status,
    };
    const body = JSON.stringify(updatedData); // Serialize the updated data

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headers,
        body: body,
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message from backend if exists
        toast.error(data.msg || "Failed to update Todo");
      } else {
        // Show success notification
        toast.success("Todo updated successfully");
        dispatch(
          updateTodo({
            id: data._id,
            status: data.status,
            title: data.name,
            description: data.description,
          })
        );
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    }
  };
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
        setTitle(data.name);
        setDescription(data.description);
        setStatus(data.status ? "completed" : "todo");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const path = window.location.pathname; // Get the full URL path
    const id = path.split("/").pop(); // Get the last part of the path (id)

    if (id) {
      getToDoTaskDetail(id); // Fetch task details with the extracted id
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming `onUpdate` is a callback passed as a prop to handle task update
    console.log({ title, description, status });
    updateTodoTask(task._id, title, description, status === "completed");
    router.push("/tasks");
  };
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
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Update Task
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Modify your task details and keep your productivity on track.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-control">
              <label
                className="label text-gray-700 font-semibold"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="input input-bordered w-full focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Description */}
            <div className="form-control">
              <label
                className="label text-gray-700 font-semibold"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                className="textarea textarea-bordered w-full focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Status */}
            <div className="form-control">
              <label
                className="label text-gray-700 font-semibold"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="select select-bordered w-full focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="todo">To-Do</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className=" flex justify-between flex-wrap gap-4   mt-6">
              <button
                className="btn btn-primary"
                onClick={() => router.push(`/tasks`)}
              >
                Back
              </button>
              <button type="submit" className="btn btn-secondary">
                Update Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
