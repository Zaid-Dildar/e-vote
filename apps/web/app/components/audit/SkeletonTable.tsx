interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export default function SkeletonTable({
  rows = 8,
  columns = 5,
}: SkeletonTableProps) {
  return (
    <div className=" overflow-x-auto rounded-lg shadow-lg border-2 border-gray-400">
      <div className="w-max min-w-full">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex space-x-4 ${
              rowIndex === 0 ? "bg-[#112B4F]" : "bg-gray-100"
            } border-0 border-t-2 last-of-type:border-b-0 first-of-type:border-t-0 border-gray-400 sm:min-w-full`}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`py-6 ${colIndex !== columns - 1 && "border-r-2 border-gray-400"} ${colIndex === 0 && "ml-2"} relative overflow-hidden max-md:min-w-[120px] ${columns === 1 ? " w-full" : "w-1/4"}`}
              >
                <div className="absolute left-1 inset-3 rounded-sm bg-gradient-to-r from-gray-400 via-[#bcbdbf] via-40% to-gray-400 to-90% animate-gradient-move"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
