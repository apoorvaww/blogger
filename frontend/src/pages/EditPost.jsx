import React, { useEffect, useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Input, Select, RTE, Button } from "../components/index.js";

const EditPost = () => {
  const blogId = useParams()
  const [post, setPost] = useState(null);
  const { register, handleSubmit, setValue, watch, control, reset } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "inactive",
    },
  });
  // console.log("control to rte", control);
  console.log(blogId.blogId)

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  // console.log(userData)

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

  // Reset form with post values once available
  useEffect(() => {
    if (post) {
      reset({
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        status: post.published ? "active" : "inactive",
      });
    }
  }, [post, reset]);

  // Auto-update slug when title changes
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

  useEffect(()=>{
    const getPost = async() => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs/get-single-blog/${blogId.blogId}`, {
          withCredentials: true
        })
        // console.log(res.data.data)
        setPost(res.data.data);
      } catch (error) {
        console.error("error while fetching post:", error)
      }
    }
    if(blogId) {
      getPost();
    }
  },[blogId])

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", data.content);
      formData.append("published", data.status === "active");

      if (data.image?.[0]) {
        formData.append("coverImage", data.image[0]);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/update-blog-post/${post._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("response after updating: ", response.data.data)

      if (response.data.success) {
        navigate(`/post/${response.data.data._id}`);
      }
    } catch (error) {
      console.error("Error updating blog post:", error);
    }
  };



  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap max-w-6xl mx-auto px-4 py-10 gap-6"
    >
      {/* Main Form Section */}
      <div className="w-full lg:w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Enter post title"
          className="mb-4"
          {...register("title", { required: true })}
        />

        <Input
          label="Slug :"
          placeholder="Post slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />

        {/* Controlled RTE */}

        {post &&(<RTE
          label="Content :"
          control={control}
          // value={field.value}
          // onChange={field.onChange}
          defaultValue={post?.content || ""}
        />)}
      </div>

      {/* Sidebar Section */}
      <div className="w-full lg:w-1/3 px-2">
        <Input
          label="Change Featured Image :"
          type="file"
          className="mb-4"
          accept="image/*"
          {...register("image")}
        />

        {post?.coverImage && (
          <div className="w-full mb-4">
            <img
              src={post.coverImage}
              alt={post.title}
              className="rounded-xl w-full object-cover h-48 shadow"
            />
          </div>
        )}

        <Select
          label="Status"
          options={["active", "inactive"]}
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 transition duration-200"
        >
          Update Post
        </Button>
      </div>
    </form>
  );
};

export default EditPost;
