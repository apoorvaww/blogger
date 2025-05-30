import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    coverImage: {
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate slugs per user (optional)
blogSchema.index({ owner: 1, slug: 1 }, { unique: true });

// Slug generation logic
blogSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  // Check for existing slugs for the same owner
  while (
    await mongoose.models.Blog.findOne({ slug, owner: this.owner, _id: { $ne: this._id } })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;
  next();
});

export const Blog = mongoose.model("Blog", blogSchema);
