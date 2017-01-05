const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {
	it('can create a subdocument', (done) => {
		const joe = new User({
			name: 'joe',
			posts: [{title: 'postTitle'}]
		});

		joe.save()
			.then(() => User.findOne({name: 'joe'}))
			.then((user) => {
				assert(user.posts[0].title === 'postTitle');
				done();
			});
	});

	it('can add subdocuments to an existing record', (done) => {
		const joe = new User({
			name: 'joe',
			posts: []
		});

		joe.save()
			.then(() => User.findOne({name: 'joe'}))
			.then((user) => {
				user.posts.push({title: 'newPost'});
				return user.save();
			})
			.then(() => User.findOne({name: 'joe'}))
			.then((user) => {
				assert(user.posts[0].title === 'newPost');
				done();
			})
	});

	it('can remove subdocuments from an existing record', (done) => {
		const joe = new User({
			name: 'joe',
			posts: [{title: 'newTitle'}]
		});

		joe.save()
			.then(() => User.findOne({name: 'joe'}))
			.then((user) => {
				const post = user.posts[0];
				assert(user.posts.length === 1);
				post.remove();
				return user.save();
			})
			.then(() => User.findOne({name: 'joe'}))
			.then((user) => {
				assert(user.posts.length === 0);
				done();
			})
	})
})