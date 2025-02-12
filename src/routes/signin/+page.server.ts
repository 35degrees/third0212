import { auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const session = await auth.api.getSession({ headers: event.request.headers });

  const redirectPath = "/dashboard";

  if (session) {
    redirect(302, redirectPath);
  }

  // Also used on client signin page as callbackURL
  return {
    redirectPath,
  };
};
