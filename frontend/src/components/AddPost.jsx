import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "./index.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const AddPost = ({ post }) => {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.published ? "active" : "inactive",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  // console.log(userData);

  const submit = async (data) => {
    try {
      console.log("data", data)
      const formdata = new FormData();
      formdata.append("title", data.title);
      formdata.append("slug", data.slug);
      formdata.append("content", data.content);
      formdata.append("published", data.status === "active");
      formdata.append("owner", userData.$id);

      if (data.image?.[0]) {
        formdata.append("coverImage", data.image[0]);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/create-blog-post`,
        formdata,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.data);
      toast.success("Blog Post Created Successfully")
      navigate(`/post/${response.data.data.blog._id}`)
    } catch (error) {
      console.error("error occurred while creating blog post", error);
      toast.error( error.message);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          {post ? "Update Blog Post" : "Create Blog Post"}
        </h1>
        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Left column - main content */}
          <div className="flex-1">
            <Input
              label="Title"
              placeholder="Enter post title"
              className="mb-4"
              {...register("title", { required: true })}
            />
            <Input
              label="Slug"
              placeholder="Auto-generated or custom slug"
              className="mb-4"
              {...register("slug", { required: true })}
              onInput={(e) =>
                setValue("slug", slugTransform(e.currentTarget.value), {
                  shouldValidate: true,
                })
              }
            />
            <RTE
              label="Content"
              name="content"
              control={control}
              defaultValue={getValues("content")}
            />
          </div>

          {/* Right column - sidebar */}
          <div className="w-full lg:w-[320px] space-y-4">
            <Input
              label="Featured Image"
              type="file"
              accept="image/*"
              {...register("image", { required: !post })}
            />
            {post?.coverImage && (
              <div>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="rounded-lg shadow-sm w-full"
                />
              </div>
            )}
            <Select
              label="Status"
              options={["active", "inactive"]}
              {...register("status", { required: true })}
            />
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl shadow transition"
            >
              {post ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
