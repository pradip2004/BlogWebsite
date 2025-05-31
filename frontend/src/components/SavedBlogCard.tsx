import React from "react";
import { BookmarkMinus, Calendar } from "lucide-react";
import moment from "moment";
import Link from "next/link";

interface SavedBlogCardProps {
  image: string;
  title: string;
  desc: string;
  id: string;
  time: string;
  onUnsave: () => void;
}

const SavedBlogCard: React.FC<SavedBlogCardProps> = ({
  image,
  title,
  desc,
  id,
  time,
  onUnsave,
}) => {
  return (
    <div className="group relative bg-secondary rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="w-full h-[180px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={onUnsave}
          className="absolute top-3 right-3 bg-white/80 hover:bg-[#ef233c] hover:text-white text-[#ef233c] rounded-full p-2 shadow transition"
          aria-label="Unsave blog"
        >
          <BookmarkMinus size={22} />
        </button>
      </div>
      <Link
        href={`/blog/${id}`}>
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h2 className="text-lg font-bold text-primary mb-1 line-clamp-1">{title}</h2>
          <p className="text-[var(--tertiary)] text-sm mb-2 line-clamp-2">{desc}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50 mt-2">
          <Calendar size={16} />
          <span>{moment(time).format("DD MMM YYYY")}</span>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default SavedBlogCard;