import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import { GlobalStateContext } from "@utils/context-provider";
import { useContext } from "react";

const WidthToggle = () => {
  const { preferences, setPreferences } = useContext(GlobalStateContext);
  return (
    <button
      className="hidden cursor-pointer rounded-lg p-1.5 text-base-content/85 transition-colors duration-150 hover:text-base-content lg:block"
      title={
        preferences.fullWidth ? "Limit page width" : "Use full screen width"
      }
      aria-label="Toggle full width"
      onClick={() =>
        setPreferences({ ...preferences, fullWidth: !preferences.fullWidth })
      }
    >
      {preferences.fullWidth ? (
        <ArrowsPointingInIcon className="size-6" />
      ) : (
        <ArrowsPointingOutIcon className="size-6" />
      )}
    </button>
  );
};

export default WidthToggle;
