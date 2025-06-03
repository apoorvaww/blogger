import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const fallbackImage =
  "https://media.istockphoto.com/id/1180410208/vector/landscape-image-gallery-with-the-photos-stack-up.jpg?s=612x612&w=0&k=20&c=G21-jgMQruADLPDBk7Sf1vVvCEtPiJD3Rf39AeB95yI=";

const PostCard = ({ id, title, featureImage }) => {
  // const loggedInUser = useSelector((state) => state.auth.userData);
  // console.log(loggedInUser);
  return (
    <Link
      to={`/post/${id}`}
      className="block transition-transform hover:scale-[1.02]"
    >
      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full border border-gray-100">
        {/* Image */}
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={featureImage || fallbackImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold text-slate-800 mb-2 leading-snug line-clamp-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-auto pt-2">Read more →</p>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
