import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/employee")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (
      !context.session ||
      (context.session.user.role !== "admin" &&
        context.session.user.role !== "manager" &&
        context.session.user.role !== "employee")
    ) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
