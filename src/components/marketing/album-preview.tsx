/** Decorative open-album illustration built from CSS blocks (no stock imagery yet). */
const L = ["bg-[#d9c7b4]", "bg-[#c9d1c4]", "bg-[#e6d8cc]", "bg-[#b9a794]"];
const R = ["bg-[#cfd8dc]", "bg-[#e9dfd3]", "bg-[#bfae9c]", "bg-[#dcd3c6]"];

export function AlbumPreview() {
  return (
    <div role="img" aria-label="Illustration of an open photo album with wedding, family and travel photo layouts"
      className="mx-auto grid w-full max-w-2xl grid-cols-2 overflow-hidden rounded-2xl border border-border bg-[#fdfcfa] shadow-sm">
      <div className="grid aspect-[3/4] grid-cols-2 grid-rows-3 gap-2 border-r border-border p-4">
        <div className={`${L[0]} col-span-2 row-span-2 rounded-sm`} />
        <div className={`${L[1]} rounded-sm`} />
        <div className={`${L[2]} rounded-sm`} />
      </div>
      <div className="grid aspect-[3/4] grid-cols-2 grid-rows-3 gap-2 p-4">
        <div className={`${R[0]} rounded-sm`} />
        <div className={`${R[1]} row-span-2 rounded-sm`} />
        <div className={`${R[2]} rounded-sm`} />
        <div className="col-span-2 flex items-end">
          <span className="font-serif text-sm italic text-secondary-foreground">Our favourite year</span>
        </div>
      </div>
    </div>
  );
}
