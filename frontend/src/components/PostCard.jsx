import React from "react";
import { Link } from "react-router-dom";

const fallbackImage =
  "https://media.istockphoto.com/id/1180410208/vector/landscape-image-gallery-with-the-photos-stack-up.jpg?s=612x612&w=0&k=20&c=G21-jgMQruADLPDBk7Sf1vVvCEtPiJD3Rf39AeB95yI=";

const PostCard = ({ id, title, featureImage }) => {
  return (
    <Link
      to={`/post/${id}`}
      className="block transition transform hover:scale-[1.02]"
    >
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 h-full  flex flex-col">
        {/* Image */}
        <div className="h-48 w-full overflow-hidden">
          <img
            src={featureImage || fallbackImage}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between flex-grow">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            {title.length > 80 ? title.substring(0, 80) + "..." : title}
          </h2>
          <p className="text-sm text-gray-500">Read more</p>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
