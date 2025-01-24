"use client";
import { useDispatch } from "react-redux";
import { deleteTodo, updateTodo } from "../redux/todoSlice"; // Import the deleteTodo action
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TaskItem({ id, title, description, initialStatus }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(initialStatus);
  useEffect(() => {
    console.log("TaskItem mounted", id, title, description, initialStatus);
  }, []);
  const deleteTaskToDo = async (id) => {
    const url = `https://todos-api-aeaf.onrender.com/api/v1/todo/delete?id=${id}`;
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

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message from backend if exists
        toast.error(data.msg || "Failed to delete Todo");
      } else {
        // Show success notification
        toast.success("Todo deleted successfully");
        dispatch(deleteTodo(id));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    }
  };
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
        // Dispatch action to update the Todo in the Redux store or state
        dispatch(
          updateTodo({
            id: data._id,
            status: data.status,
          })
        ); // Replace with your appropriate Redux action
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    }
  };

  const deleteTask = (id) => {
    // Dispatch the action to remove the task from Redux store
    deleteTaskToDo(id);
  };

  const updateTaskStatus = async (e) => {
    const newStatus = e.target.value === "completed"; // Convert "completed" to true and "todo" to false
    setStatus(newStatus);

    // Dispatch the action to update the task status in Redux store
    updateTodoTask(id, title, description, newStatus); // Pass the new status value
  };

  // Determine the border color based on the status
  const getStatusBorderColor = () => {
    switch (initialStatus) {
      case false:
        return "border-sky-500";
      case true:
        return "border-green-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div
      className={`card bg-white shadow-lg border-4 ${getStatusBorderColor()} hover:shadow-xl transition-transform transform hover:scale-105`}
    >
      <div className="card-body p-4">
        {/* Title */}
        <h2
          className="card-title text-xl font-semibold text-gray-800 cursor-pointer hover:underline"
          onClick={() => router.push(`detail/${id}`)}
        >
          {title}
        </h2>
        {/* Description */}
        <p
          className="text-gray-600 cursor-pointer mt-2 "
          onClick={() => router.push(`detail/${id}`)}
        >
          {description.length > 200
            ? `${description.slice(0, 150)}...`
            : description}
        </p>

        {/* Card Actions */}
        <div className="card-actions justify-between mt-4">
          {/* Status Dropdown */}
          <select
            className="select select-bordered select-sm focus:outline-none focus:ring focus:ring-blue-300"
            defaultValue={!initialStatus ? "todo" : "completed"}
            onChange={(e) => updateTaskStatus(e)}
          >
            <option value="todo">To-Do</option>
            <option value="completed">Completed</option>
          </select>

          {/* Delete Button */}
          <button
            className="btn btn-sm btn-error hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
            onClick={() => deleteTask(id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
