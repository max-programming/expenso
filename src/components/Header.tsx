import { Link, useNavigate } from "@tanstack/react-router";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { getSession } from "@/server/get-session";
import { Button } from "./ui/button";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { authMiddleware } from "@/server/auth-middleware";
import { getRequest } from "@tanstack/react-start/server";

const signOut = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { headers } = getRequest();
    await auth.api.signOut({ headers });
  });

export default function Header({
  session,
}: {
  session: Awaited<ReturnType<typeof getSession>> | null;
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <h1 className="text-xl font-semibold">Expenso</h1>
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {session &&
            (session.user.role === "admin" ? (
              <>
                <Link
                  to="/admin/users"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                  activeProps={{
                    className:
                      "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
                  }}
                >
                  <span className="font-medium">Users</span>
                </Link>
                <Link
                  to="/admin/categories"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                  activeProps={{
                    className:
                      "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
                  }}
                >
                  <span className="font-medium">Expense Categories</span>
                </Link>
                <Link
                  to="/admin/approval-rules"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                  activeProps={{
                    className:
                      "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
                  }}
                >
                  <span className="font-medium">Approval Rules</span>
                </Link>
              </>
            ) : session.user.role === "manager" ? (
              <>
                <Link
                  to="/manager/approvals"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                  activeProps={{
                    className:
                      "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
                  }}
                >
                  <span className="font-medium">Approvals</span>
                </Link>
              </>
            ) : session.user.role === "employee" ? (
              <>
                <Link
                  to="/employee/expenses"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
                  activeProps={{
                    className:
                      "flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
                  }}
                >
                  <span className="font-medium">Expenses</span>
                </Link>
              </>
            ) : null)}
          {session && (
            <Button
              onClick={() => signOut().then(() => navigate({ to: "/sign-in" }))}
              className="gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2 w-full"
              variant="ghost"
            >
              <span className="font-medium">Logout</span>
            </Button>
          )}
        </nav>
      </aside>
    </>
  );
}
