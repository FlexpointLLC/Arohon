/**
 * The customer app's route markers, used everywhere a trip shows pickup and destination:
 * pickup = rounded square with a small centre, destination = red circle with a white centre,
 * joined by a centred 2px line. Place it in a flex row next to the two address lines;
 * `pad` vertically offsets the markers to the middle of the first and last line.
 */
export function RouteMarkers({ pad = 'py-[12px]' }: { pad?: string }) {
  return (
    <div aria-hidden className={`flex w-4 shrink-0 flex-col items-center ${pad}`}>
      <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-black dark:bg-white">
        <span className="h-[5px] w-[5px] rounded-[1px] bg-white dark:bg-black" />
      </span>
      <span className="my-1 w-0.5 flex-1 rounded-full bg-[#E5E5E5] dark:bg-white/15" />
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF3B30]">
        <span className="h-[5px] w-[5px] rounded-full bg-white" />
      </span>
    </div>
  );
}
