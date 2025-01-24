"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/auth/authContext";
export default function Login() {
  // const { isAuthenticated } = useAuth();

  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/tasks");
    }
  }, [isAuthenticated, router]);

  // If not authenticated, show nothing (or you can show a loading screen)
  if (isAuthenticated) return null;
  const loginUser = async () => {
    const url = "https://todos-api-aeaf.onrender.com/api/v1/auth/login";
    const body = {
      email: email,
      password: password,
    };

    const headers = {
      "Content-Type": "application/json",
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
        toast.error(data.msg || "Login failed");
      } else {
        // Store the token in a cookie
        toast.success("Login successful");
        Cookies.set("token", data.data.token, { expires: 7 }); // Token expires in 7 days
        setIsAuthenticated(true);
        router.push("/tasks");
        console.log("User logged in:", data);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error:", error);
    }
  };

  const submit = async () => {
    // Input validation checks
    if (!email) {
      toast.error("Email is required!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format!");
      return;
    }

    if (!password) {
      toast.error("Password is required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    loginUser();
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-gray-200 to-gray-400 overflow-hidden">
        {status === "loading" ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div className="flex h-full w-full">
            {/* Left Section */}
            <div className="w-1/2 hidden sm:flex  justify-start items-start relative">
              {/* Background Image with Gradient */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'linear-gradient(to left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0)), url("https://fileserver.teachstarter.com/thumbnails/20027-sticky-notes-template-to-do-lists-thumbnail-0-1200x628.png")',
                }}
              />
              {/* Text Overlay */}
              <div className="relative text-center bg-black bg-opacity-50 text-white rounded-lg m-4">
                <h1 className="text-2xl font-bold m-4">The ToDo App</h1>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full sm:w-1/2 flex items-center justify-center bg-white">
              <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                  <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input
                          type="email"
                          placeholder="email"
                          className="input input-bordered text-black"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="password"
                          className="input input-bordered text-black"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="label">
                          <a
                            href="#"
                            className="label-text-alt link link-hover"
                          >
                            Forgot password?
                          </a>
                        </label>
                      </div>
                      <div className="form-control mt-6">
                        <button className="btn btn-primary" onClick={submit}>
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
