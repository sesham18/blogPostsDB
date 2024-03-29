"use strict";

const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({ content: 'string' });

const blogpostsSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created: { type: String, required: false },
  author: {
    firstName: String,
    lastName: String
  },
  comments: [commentSchema]
});

//Pre hook 
blogpostsSchema.pre('findOne', function(next) {
    this.populate('author');
    next();
});
  
// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
blogpostsSchema.virtual("authorString").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});



// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
blogpostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.author,
    created: this.created
  };
};

BlogPost
  .findOne({
    title: 'another title'
  })
  .then(blogPost => {
    console.log(blogPost.serialize());
  });

blogpostsSchema.pre('find', function(next) {
    this.populate('author');
    next();
  });

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogpostsSchema);

module.exports = {BlogPost};
