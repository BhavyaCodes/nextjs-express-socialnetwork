const router = require("express").Router();
const Post = require("../models/Post");

router.post('/api/newpost', (req, res, next) => {
	const post = new Post({
		title: req.body.title,
		content: req.body.content
	})

	await post.save()
})
