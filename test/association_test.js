'use strict';

const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blog_post');

describe('Associations', () => {
	let joe, blogPost, comment;

	beforeEach((done) => {
		joe = new User({name: 'joe'});
		blogPost = new BlogPost({title: 'js is great', content: 'content'});
		comment = new Comment ({content: 'congrats on your first post'});

		joe.blogPosts.push(blogPost);
		blogPost.comments.push(comment);
		comment.user = joe;

		Promise.all([joe.save(), blogPost.save(), comment.save()])
			.then(() => done());
	});

	it('saves a relation between a user and a blogpost', (done) => {
		User.findOne({name: 'joe'})
			.populate('blogPosts')
			.then((user) => {
				assert(user.blogPosts[0].title === 'js is great');
				done();
			})
	});

	it('saves a full relation tree', (done) => {
		User.findOne({name: 'joe'})
			.populate({
				path: 'blogPosts',
				populate: {
					path: 'comments',
					model: 'comment',
					populate: {
						path: 'user',
						model: 'user'
					}
				}
			})
			.then((user) => {
				assert(user.name === 'joe');
				assert(user.blogPosts[0].title === 'js is great');
				assert(user.blogPosts[0].comments[0].content === 'congrats on your first post');
				assert(user.blogPosts[0].comments[0].user.name === 'joe');
				done();
			})
	});
})