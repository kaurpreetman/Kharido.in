import { Star } from "lucide-react";

export const StarRating = ({ rating = 0, onRate, interactive = false, size = 5 }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(size)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 cursor-pointer ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
          onClick={() => interactive && onRate && onRate(i + 1)}
        />
      ))}
    </div>
  );
};
