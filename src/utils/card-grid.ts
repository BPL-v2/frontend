import { GlobalStateContext } from "@utils/context-provider";
import { useContext } from "react";

// Responsive card grid. In full width mode the column count is not fixed
// anymore: cards have a minimum width and as many as fit are placed per row,
// growing evenly to fill the container.
export function useCardGridClass(responsiveCols: string): string {
  const { preferences } = useContext(GlobalStateContext);
  return preferences.fullWidth
    ? "grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]"
    : responsiveCols;
}
