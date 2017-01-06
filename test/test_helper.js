const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
mongoose.connect('mongodb://localhost/users_test');
mongoose.connection
	.once('open', () => {
		done();
	})
	.on('error', (err) => {
		console.warn('Warning', err);
	});
});


beforeEach((done) => {
	mongoose.connection.collections.users.drop(() => {
		mongoose.connection.collections.comments.drop(() => {
			mongoose.connection.collections.blogposts.drop(() => {
				done();
			});
		});
	});
});