import { Character, GameVersion } from "@client/api";
import { useGetEvents } from "@client/query";
import { ascendancies, phreciaMapping, poe2Mapping } from "@mytypes/ascendancy";
import { Link } from "@tanstack/react-router";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface ProfileCarouselProps {
  userCharacters: Character[];
  userId: number;
}

export function ProfileCarousel({
  userCharacters,
  userId,
}: ProfileCarouselProps) {
  const { events } = useGetEvents();
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: "auto", spacing: 8 },
  });

  return (
    <div className="flex items-center gap-0">
      <ChevronLeftIcon
        className="w-10 cursor-pointer stroke-3 hover:stroke-primary"
        onClick={() => instanceRef.current?.prev()}
      />
      <div ref={sliderRef} className="keen-slider">
        {userCharacters
          .sort((b, a) => a.event_id - b.event_id)
          .map((char) => {
            const event = events?.find((e) => e.id == char.event_id);
            if (!event) {
              return null;
            }
            let ascendancyName = char.ascendancy;
            let ascendancyObj;
            if (event.game_version === GameVersion.poe2) {
              ascendancyName = poe2Mapping[char.ascendancy] || char.ascendancy;
              ascendancyObj = ascendancies[GameVersion.poe2][ascendancyName];
            } else {
              ascendancyObj =
                ascendancies[GameVersion.poe1][
                  phreciaMapping[char.ascendancy] || char.ascendancy
                ];
            }
            return (
              <Link
                to={"/profile/$userId/$eventId/$characterId"}
                params={{
                  characterId: char.id,
                  userId: userId,
                  eventId: char.event_id,
                }}
                key={char.event_id + char.name}
                className="keen-slider__slide flex min-w-95 cursor-pointer flex-row items-center gap-2 overflow-visible! rounded-full border-4 bg-base-300 select-none"
                activeProps={{
                  className: "border-primary",
                }}
                inactiveProps={{
                  className: "border-transparent",
                }}
              >
                <img
                  src={ascendancyObj.thumbnail}
                  className="size-22 rounded-full"
                  alt={ascendancyName}
                  draggable={false}
                />
                <div className="rounded-r-full text-left">
                  <p className="text-xl font-bold">
                    {event.name.split(" (PL")[0]}
                  </p>
                  <div className="text-lg">
                    <p>{char.name}</p>
                    <div className="flex flex-row gap-2">
                      <span>Level {char.level}</span>
                      <span
                        className={twMerge(
                          "font-bold",
                          ascendancyObj.classColor,
                        )}
                      >
                        {ascendancyName}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <ChevronLeftIcon
        className="w-10 rotate-180 cursor-pointer stroke-3 hover:stroke-primary"
        onClick={() => instanceRef.current?.next()}
      />
    </div>
  );
}
