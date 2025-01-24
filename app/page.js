"use client";
import { useAuth } from "@/auth/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const { isAuthenticated } = useAuth();

  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/tasks");
    }
  }, [isAuthenticated, router]);

  // If not authenticated, show nothing (or you can show a loading screen)
  // if (isAuthenticated) return null;
  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">
              Stay organized and boost your productivity with our To-Do App.
              Create, manage, and track your tasks effortlessly, all in one
              place!
            </p>
            <button
              className="btn btn-primary mr-8"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/signup")}
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
