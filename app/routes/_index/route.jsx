import { redirect } from "react-router";
import { login } from "../../shopify.server";
import { readFileSync } from "fs";
import { join } from "path";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  
  const html = readFileSync(join(process.cwd(), "public/landing.html"), "utf-8");
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};

export default function Index() {
  return null;
}
