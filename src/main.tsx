import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import "./App.css";
import ContextWrapper from "./components/app-context";
import { routeTree } from "./routeTree.gen";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootElement = document.getElementById("root")!;
const queryClient = new QueryClient();

// GitHub Pages has no server-side rewrite, so a hard refresh on a client
// routed URL 404s and gets redirected here by public/404.html, which stows
// the intended path in sessionStorage. Restore it before the router reads
// the current location.
const redirect = sessionStorage.getItem("spa-redirect");
if (redirect) {
  sessionStorage.removeItem("spa-redirect");
  const target = import.meta.env.BASE_URL.replace(/\/$/, "") + redirect;
  window.history.replaceState(null, "", target);
}

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  defaultPreload: "intent",
  defaultStaleTime: 0,
  scrollRestoration: true,
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const root = import.meta.hot?.data.root ?? ReactDOM.createRoot(rootElement);
if (import.meta.hot) {
  import.meta.hot.data.root = root;
}
root.render(
  <QueryClientProvider client={queryClient}>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    <ContextWrapper>
      <RouterProvider router={router} />
    </ContextWrapper>
  </QueryClientProvider>,
);
