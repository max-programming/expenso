import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.session || context.session.user.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
