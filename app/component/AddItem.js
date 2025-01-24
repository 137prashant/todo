"use client";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, deleteTodo, updateTodo } from "../redux/todoSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function AddItem() {
  const router = useRouter();

  const todos = useSelector((state) => state.todo.todos);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createTodo = async () => {
    const url = "https://todos-api-aeaf.onrender.com/api/v1/todo/create";
    const token = Cookies.get("token"); // Get the token from cookies

    if (!token) {
      toast.error("You need to log in first");
      router.push("/login");
      return;
    }

    const body = {
      name: title,
      description: description,
      status: false,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message from backend if exists
        toast.error(data.msg || "Failed to create Todo");
      } else {
        // Dispatch action to add the new Todo to the Redux store
        const task = {
          id: data._id, // Get the task ID from the response
          title: data.name, // The title of the task
          description: data.description, // The description of the task
          status: false,
        };
        dispatch(addTodo(task)); // Dispatch the action to update the Redux store

        // Reset the form fields
        setTitle("");
        setDescription("");

        // Close the modal
        document.getElementById("my_modal_1").close();

        // Show success notification
        toast.success("Task added successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    }
  };

  const addTask = () => {
    if (title === "" || description === "") {
      toast.error("Please fill all the fields");
      return;
    }
    createTodo();
  };
  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add a task</h3>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
          <button className="btn btn-primary" onClick={addTask}>
            Add Task
          </button>
        </div>
      </div>
    </dialog>
  );
}
