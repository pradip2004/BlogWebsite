import Link from "next/link";
import React from "react";
import { Card } from "./ui/card";
import { Calendar } from "lucide-react";
import moment from "moment";

interface BlogCardProps {
  image: string;
  title: string;
  desc: string;
  id: string;
  time: string;
  category?: string;  
  
}

const BlogCard: React.FC<BlogCardProps> = ({
  image,
  title,
  desc,
  id,
  time,
  category
  
}) => {
  return (
    <Link href={`/blog/${id}`}>
      <Card className="flex flex-row items-center gap-4 overflow-hidden rounded-2xl shadow-none transition-shadow duration-300 hover:shadow-xl border-none bg-primary border border-dashed border-2 border-secondary min-h-[120px]">
        <div className="flex-shrink-0 w-80 h-40 ml-4 flex items-center justify-center">
          <img
            src={image}
            alt={title}
            className="w-72 h-40 rounded-xl object-cover border-2 border-[#ef233c] bg-primary"
          />
        </div>
        <div className="flex-1 py-2 pr-4">
          <h2 className="text-3xl font-semibold line-clamp-1 text-[var(--tertiary)]">
            {title}
          </h2>
          <p className="text-secondary text-sm mt-1 line-clamp-2">
            {desc}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {moment(time).format("DD-MM-YYYY")}
            </span>
            <span className="font-medium text-secondary">{category}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;