import "./globals.css";
import { ToastContainer, toast } from "react-toastify";

import ReduxProvider from "./redux/ReduxProvider";
import { AuthProvider } from "@/auth/authContext";
export const metadata = {
  title: "ToDo App",
  description: "A simple todo app built with React and DaisyUI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body suppressHydrationWarning>
        <ReduxProvider>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </ReduxProvider>

        <ToastContainer position="bottom-right" autoClose={2000} />
      </body>
    </html>
  );
}
