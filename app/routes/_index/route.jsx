import { redirect } from "react-router";
import landingHtml from "../../../public/landing.html?raw";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return new Response(landingHtml, {
    headers: { "Content-Type": "text/html" },
  });
};
