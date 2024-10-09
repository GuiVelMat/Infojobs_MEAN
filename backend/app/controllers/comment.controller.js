const Product = require('../models/product.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const asyncHandler = require('express-async-handler');
// const User = require('../models/user.model');

const addCommentsToProduct = asyncHandler(async (req, res) => {

    // return res.json({ message: "andrea mosca" })
    const id = req.userId;

    const commenter = await User.findById(id).exec();
    // return res.json(commenter);

    if (!commenter) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }
    const { slug } = req.params;
    // return res.json(slug)

    // console.log(`the slug is ${slug}`)
    const product = await Product.findOne({ slug }).exec();
    // return res.json(product);

    if (!product) {
        return res.status(401).json({
            message: "Product Not Found"
        });
    }

    // return res.json(req.comment);

    const { body } = req.body.comment;
    // return res.json(body);

    const newComment = await Comment.create({
        body: body,
        author: commenter._id,
        product: product._id
    });

    await product.addComment(newComment._id);

    return res.status(200).json({
        comment: await newComment.toCommentResponse(commenter)
    })

});

const getCommentsFromProduct = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).exec();

    if (!product) {
        return res.status(401).json({
            message: "Product Not Found"
        });
    }

    const loggedin = req.loggedin;

    if (loggedin) {
        const loginUser = await User.findById(req.userId).exec();
        return await res.status(200).json({
            comments: await Promise.all(product.comments.map(async commentId => {
                const commentObj = await Comment.findById(commentId).exec();
                return await commentObj.toCommentResponse(loginUser);
            }))
        })
    } else {
        return await res.status(200).json({
            comments: await Promise.all(product.comments.map(async (commentId) => {
                const commentObj = await Comment.findById(commentId).exec();
                // console.log(commentObj);
                const temp = await commentObj.toCommentResponse(false);
                // console.log(temp);
                return temp;
            }))
        })
    }
});

const deleteComment = asyncHandler(async (req, res) => {
    // return res.json("hola");
    const userId = req.userId;

    const commenter = await User.findById(userId).exec();

    if (!commenter) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }
    const { slug, id } = req.params;

    const product = await Product.findOne({ slug }).exec();

    if (!product) {
        return res.status(401).json({
            message: "Product Not Found"
        });
    }

    const comment = await Comment.findById(id).exec();

    // console.log(`comment author id: ${comment.author}`);
    // console.log(`commenter id: ${commenter._id}`)

    if (comment.author.toString() === commenter._id.toString()) {
        await product.removeComment(comment._id);
        await Comment.deleteOne({ _id: comment._id });
        return res.status(200).json({
            message: "comment has been successfully deleted!!!"
        });
    } else {
        return res.status(403).json({
            error: "only the author of the comment can delete the comment"
        })
    }
});

module.exports = {
    addCommentsToProduct,
    getCommentsFromProduct,
    deleteComment
}
