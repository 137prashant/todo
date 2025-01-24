"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import TaskItem from "../component/TaskItem";
import AddItem from "../component/AddItem";
import { addTodo } from "../redux/todoSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/authContext";
import Cookies from "js-cookie";
import { useRef } from "react";
import NavBar from "@/app/component/NavBar";
export default function Tasks() {
  const { isAuthenticated } = useAuth();
  const todos = useSelector((state) => state.todo.todos); // Redux state
  const router = useRouter();
  const dispatch = useDispatch();

  const [currentData, setCurrentData] = useState([]); // Local state for filtered data
  const [filterType, setFilterType] = useState("all"); // Filter type
  const fetchOnce = useRef(false);
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // If not authenticated, show nothing (or you can show a loading screen)
  // if (!isAuthenticated) return null;
  const getAllTodos = async () => {
    const url = "https://todos-api-aeaf.onrender.com/api/v1/todo/getAll";
    const token = Cookies.get("token"); // Get the token from cookies

    if (!token) {
      toast.error("You need to log in first");
      router.push("/login");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message from backend if exists
        toast.error(data.msg || "Failed to fetch Todos");
      } else {
        // Dispatch all tasks to Redux store
        data.forEach((task) => {
          const taskData = {
            id: task._id, // Get the task ID from the response
            title: task.name, // The title of the task
            description: task.description, // The description of the task
            status: task.status, // The status of the task
          };
          dispatch(addTodo(taskData)); // Dispatch the action to update the Redux store
        });

        // Show success notification
        toast.success("Tasks loaded successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if (fetchOnce.current) return; // Skip if already ran
    fetchOnce.current = true; // Mark as ran
    getAllTodos();
  }, []);
  // Sync currentData with todos whenever todos changes
  useEffect(() => {
    applyFilters();
  }, [todos, filterType]);

  // Filter tasks based on search input
  const filterBasedOnSearch = (e) => {
    const search = e.target.value;
    const filteredData = todos.filter((todo) =>
      todo.title.toLowerCase().includes(search.toLowerCase())
    );
    setCurrentData(filteredData);
  };

  // Apply filters based on status
  const applyFilters = () => {
    console.log("Filtering based on:", todos);
    let filteredData = todos;
    if (filterType === "todo") {
      filteredData = todos.filter((todo) => todo.status === false);
    } else if (filterType === "completed") {
      filteredData = todos.filter((todo) => todo.status === true);
    }
    setCurrentData(filteredData);
  };
  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen py-10 px-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto mt-20 min-h-[80vh]">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 md:mb-0">
              Tasks
            </h1>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="input input-bordered w-full md:w-auto focus:outline-none focus:ring focus:ring-blue-300"
                  onChange={(e) => filterBasedOnSearch(e)}
                />
              </div>
              {/* Filter Dropdown */}
              <select
                className="select select-bordered focus:outline-none focus:ring focus:ring-blue-300"
                onChange={(e) => setFilterType(e.target.value)}
                value={filterType}
              >
                <option value="all">All</option>
                <option value="todo">To-Do</option>
                <option value="completed">Completed</option>
              </select>
              {/* Add Task Button */}
              <button
                className="btn btn-primary hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.map((todo) => (
              <TaskItem
                key={todo.id} // Add a unique key
                id={todo.id}
                title={todo.title}
                description={todo.description}
                initialStatus={todo.status}
              />
            ))}
          </div>
        </div>
        <AddItem />
      </div>
    </>
  );
}
