import { auth } from '@/lib/auth';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getRequest();
    const session = await auth.api.getSession({ headers });
    console.log(session);
    return session;
  }
);