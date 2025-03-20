interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export default function SkeletonTable({
  rows = 8,
  columns = 5,
}: SkeletonTableProps) {
  return (
    <div className="lg:mx-7 lg:w-[calc(100%-1.8rem)] overflow-x-auto ">
      <div className="w-max min-w-full">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex space-x-4 ${
              rowIndex === 0 ? "bg-gray-900" : "bg-gray-300"
            } p-4 max-md:min-w-[600px] sm:min-w-full`}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`h-6 relative overflow-hidden w-1/4 max-md:min-w-[120px]`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-[#bcbdbf] via-40% to-gray-400 to-90% animate-gradient-move"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
