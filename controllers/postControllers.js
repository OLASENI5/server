import  uploadPicture  from "../middleware/uploadPictureMiddleware.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import fileRemover  from "../utils/fileRemover.js";
import { v4 as uuid4 } from "uuid";

const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: "sample title",
      caption: "sample caption",
      slug: uuid4(), 
      body: {
        type: "doc",
        content: [],
      },
      photo: "",
      user: req.user._id,
    });

    const createPost = await post.save();
    return res.json(createPost);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.parans.slug });
    if (!post) {
      const error = new Error("Post aws not found");
      next(error);
      return;
    }

    const upload = uploadPicture.single("postPicture");

    const handleUpdatePostData = async (data) => {
      const { title, caption, slug, body, tages, categories } =
        JSON.parse(data);
      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tages = tages || post.tages;
      post.categories = categories || post.categories;
      const updatePost = await post.save();
      return res.json(updatePost);
    };

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occurred when uploading" + err.message
        );
        next(error);
      } else {
        // Everything went well
        if (req.file) {
          let filename;
          filename = post.photo;
          if (filename) {
            fileRemover(filename);
          }
          post.photo = req.file.filename;
          handleUpdatePostData(req.body.document);
        } else {
          let filename;
          filename = post.photo;
          post.photo = "";
          fileRemover(filename);
          handleUpdatePostData(req.body.document);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete({ slug: req.parans.slug });

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    await Comment.deleteMany({ post: post._id });

    return res.json({
      message: "Post is successfully deleted",
    });
  } catch (error) {
    next(eeror);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.parans.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "comments",
        match: {
          check: true,
          parent: null,
        },
        populate: [
        {
            path: "user",
            select: ["avatar", "name"]
        },
        {
            path: "replies",
            match: {
                check: true,
            }
        }
        ],
      },
    ]);

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
};

const getAllposts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate([
      {
        path: "user",
        select: ["avatar", "name", "varified"],
      }
    ]);

    res.json(posts);
  } catch (error) {
    next(error)
  }
};

export { createPost, updatePost, deletePost, getPost, getAllposts };
