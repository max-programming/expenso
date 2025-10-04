import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/manager")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (
      !context.session ||
      (context.session.user.role !== "admin" &&
        context.session.user.role !== "manager")
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
