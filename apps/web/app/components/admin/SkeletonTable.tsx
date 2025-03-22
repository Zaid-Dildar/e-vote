interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export default function SkeletonTable({
  rows = 8,
  columns = 5,
}: SkeletonTableProps) {
  return (
    <div className=" overflow-x-auto rounded">
      <div className="w-max min-w-full">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex space-x-4 ${
              rowIndex === 0 ? "bg-[#112B4F]" : "bg-gray-100"
            } border-3 border-t-0 border-b-gray-900 max-md:min-w-[600px] sm:min-w-full`}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`py-6 ${colIndex !== columns - 1 && "border-r-3"} ${colIndex === 0 && "ml-2"} relative overflow-hidden w-1/4 max-md:min-w-[120px]`}
              >
                <div className="absolute left-1 inset-3 bg-gradient-to-r from-gray-400 via-[#bcbdbf] via-40% to-gray-400 to-90% animate-gradient-move"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
