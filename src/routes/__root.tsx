import {
  Link,
  Outlet,
  createRootRoute,
  useRouterState,
  useSearch,
} from "@tanstack/react-router";
import { JSX, useContext, useEffect, useMemo } from "react";
import "../App.css";

import AuthButton from "@components/auth-button";
import {
  BookOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { GlobalStateContext } from "@utils/context-provider";

import { useGetEventStatus, useGetUser } from "@api";
import { Footer } from "@components/footer";
import { TwitchFilled } from "@icons/twitch";
import { twMerge } from "tailwind-merge";
import { router } from "../main";
import { addEngagementBase } from "@api";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div className="mx-auto mt-8 flex flex-col gap-8">
        <h1 className="text-2xl">Could not find page</h1>
        <Link className="link link-info" to="/">
          Return to home page
        </Link>
      </div>
    );
  },
});

type MenuItem = {
  label: string | JSX.Element;
  url: string;
  path: string;
  icon?: JSX.Element;
  visible?: boolean;
};

function RootComponent() {
  const { currentEvent } = useContext(GlobalStateContext);
  const { user } = useGetUser();
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const menu: MenuItem[] = useMemo(() => {
    const menu: MenuItem[] = [
      {
        label: <div className="text-4xl font-bold">BPL</div>,
        icon: (
          <img
            className="h-8"
            src="/assets/app-logos/bpl-logo.webp"
            alt="bpl-logo"
          />
        ),
        url: "/",
        path: "",
        visible: true,
      },
      {
        label: "Scoring",
        icon: <ChartBarIcon className="size-6" />,
        url: "/scores/ladder",
        path: "scores",
        visible: true,
      },
      {
        label: "Streams",
        icon: <TwitchFilled className="size-6" />,
        url: "/streams",
        path: "streams",
        visible: true,
      },
      {
        label: "Rules",
        icon: <BookOpenIcon className="size-6" />,
        url: "/rules",
        path: "rules",
        visible: true,
      },
      {
        label: "Team",
        icon: <UserGroupIcon className="size-6" />,
        url: "/team/atlas",
        path: "team",
        visible: !!eventStatus?.team_id,
      },
      {
        label: "Admin",
        icon: <Cog6ToothIcon className="size-6" />,
        url: "/admin",
        path: "admin",
        visible:
          (user?.permissions?.length || 0) > 0 || eventStatus?.is_team_lead,
      },
    ];
    return menu.filter((item) => item.visible);
  }, [eventStatus, user]);
  const selected = useRouterState({
    select: (state) => state.location.pathname.split("/")[1],
  });
  const { hello }: { hello: string | undefined } = useSearch({
    from: Route.id,
  });
  useEffect(() => {
    if (
      document.referrer &&
      document.location.hostname !== new URL(document.referrer).hostname
    ) {
      addEngagementBase({ name: document.referrer });
    }
  }, []);

  useEffect(() => {
    if (hello) {
      localStorage.setItem("referrer", hello);
      addEngagementBase({ name: hello });
      router.navigate({ to: router.state.location.pathname, replace: true });
    }
  }, [hello]);
  return (
    <>
      <div className="mx-auto max-w-360 overflow-x-hidden text-center">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-base-content/8 bg-base-100/80 backdrop-blur-md">
            <nav className="flex h-13 items-center justify-between px-3 sm:px-5">
              <ul className="flex items-center gap-1">
                {menu.map((item) => (
                  <li key={item.url}>
                    <Link
                      aria-label={
                        typeof item.label === "string"
                          ? item.label
                          : item.path || "home"
                      }
                      to={item.url}
                      className={twMerge(
                        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xl font-medium transition-colors duration-150",
                        item.path === "" && "mr-3",
                        selected === item.path
                          ? "text-primary"
                          : "text-base-content/85 hover:text-base-content",
                      )}
                    >
                      {item.icon}
                      {item.path === "" ? (
                        <span className="text-3xl font-bold tracking-wide text-base-content hover:text-primary transition-colors">
                          BPL
                        </span>
                      ) : (
                        <span className="hidden sm:block">{item.label}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <AuthButton />
            </nav>
          </header>
          {user && !user.account_name && (
            <div className="border-b border-warning/20 bg-warning/6 px-4 py-2 text-sm text-base-content/70">
              Connect your PoE account via the top-right button to track your
              characters.
            </div>
          )}
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default RootComponent;
