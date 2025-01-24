"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/authContext";

export default function NavBar() {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <div className="navbar bg-gradient-to-r from-blue-500 to-blue-700 text-white fixed top-0 z-10 shadow-lg">
      {/* Logo Section */}
      <div className="flex-1">
        <a
          className="text-2xl font-bold cursor-pointer hover:text-gray-200 transition duration-300"
          onClick={() => router.push("/tasks")}
        >
          ToDo App
        </a>
      </div>

      {/* Avatar and Dropdown */}
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar hover:bg-blue-600 transition duration-300"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white text-gray-800 rounded-lg z-[1] mt-3 w-52 p-2 shadow-lg"
          >
            <li>
              <a className="hover:bg-gray-100 rounded-md transition duration-300">
                Profile
                <span className="badge badge-primary">New</span>
              </a>
            </li>
            <li>
              <a className="hover:bg-gray-100 rounded-md transition duration-300">
                Settings
              </a>
            </li>
            <li>
              <a
                className="hover:bg-gray-100 rounded-md transition duration-300"
                onClick={() => {
                  // Delete all cookies
                  document.cookie.split(";").forEach((cookie) => {
                    const name = cookie.split("=")[0].trim();
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
                  });
                  setIsAuthenticated(false);
                  // Redirect to homepage
                  router.push("/");
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
