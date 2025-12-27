"use client";

import { StarIcon } from "@phosphor-icons/react";

type StarRatingProps = {
  score: number;
};

export default function StarRating({ score }: StarRatingProps) {
  const starIcons = Math.round(score / 20);

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          size={16}
          weight={i < starIcons ? "fill" : "regular"}
          className={i < starIcons ? "text-yellow-400" : "text-gray-light"}
        />
      ))}
    </div>
  );
}
