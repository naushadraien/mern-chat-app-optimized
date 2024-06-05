import fs from 'fs';
import { model, Schema } from 'mongoose';
import validator from 'validator';
// import path from 'path';

const ordersSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      validate: [
        validator.isAlpha,
        'Name should only contains string values not special characters or numbers',
      ],
    },
    size: {
      type: String,
      required: [true, 'Please provide size'], // it is validator in mongoose
      enum: {
        values: ['small', 'medium', 'large', 'extra-large'],
        message: '{VALUE} is not supported. Please select from small, medium, large, extra-large',
      }, // it is validator in mongoose
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'], // it is validator in mongoose
      min: [1, 'Price should be at least 1'], // it is validator in mongoose
      max: [100, 'Price should not exceed 100'], // it is validator in mongoose
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'], // it is validator in mongoose
      // min: [1, 'Quantity should be at least 1'], // it is validator in mongoose
      // max: [100, 'Quantity should not exceed 100'], // it is validator in mongoose
      validate: {
        // this is a custom validator in mongoose
        validator: function (value: number) {
          // this validator will only work with the create() and save() methods in mongoose but not with update() methods
          return value >= 1 && value <= 100;
        },
        // message: (props: { value: number }) => `${props.value} should be between 1 and 100`,
        message: 'Quantity should be between 1 and 100',
      },
    },
    date: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // this is to include the virtual fields when the data is sent as a response
    toObject: { virtuals: true }, // this is to include for using the virtual fields in the application as an object
  }
);

// virtual fields in mongoose
ordersSchema.virtual('totalCost').get(function () {
  // this virtual field can't be used in mongoose queries like find, findOne, etc because it is not stored in the database as it is a virtual field
  // this is a virtual field in this orderSchema that calculates the total cost of the order
  return this.price * this.quantity;
});

// document middleware in mongoose

// we can use multiple pre() and post() hooks in mongoose for the same operation

// whenever .save() or .create() is called, the following document middleware will run
// this will not run for insertMany() or findByIdAndUpdate() or findOneAndUpdate() or findByIdAndDelete() or findOneAndDelete()
// only works when save() or create() is called
ordersSchema.pre('save', function (next) {
  // this is a document middleware in mongoose that runs before the document is saved
  // console.log(this); // this is the current document that is about to be saved to the database

  console.log('Document is about to be saved');
  next(); // this is to move to the next middleware or the actual save() function or the next operation
});

ordersSchema.post('save', function (doc, next) {
  // this is a document middleware in mongoose that runs after the document is saved

  const content = `Order: ${doc.name} of size ${doc.size} has been saved with total cost of  at ${doc.date.toString()}\n`;
  // const logFilePath = path.join(__dirname, '../../log/log.txt'); // this is to get the relative path of the log.txt file from the current file

  // but if we use './log/log.txt' it will look for the log.txt file from the root directory of the project to the corresponding path
  try {
    fs.writeFileSync('./log/log.txt', content, { flag: 'a' }); // this is to write the content to the log.txt file
    console.log('Document has been saved');
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
  next();
});

// query middleware in mongoose
ordersSchema.pre(/^find/, function (next) {
  /* the regular expression /^find/ will match both find and findOne methods in Mongoose, as well as any other method that starts with "find", such as findById, findOneAndUpdate, etc. */
  // this is a query middleware in mongoose that runs before the query like find(), findOne(), etc is executed
  // console.log(this); // this is the current query object that is about to be executed

  console.log('Query is about to be executed');
  next(); // this is to move to the next middleware or the actual query execution
});

ordersSchema.post(/^find/, function (docs, next) {
  // this is a query middleware in mongoose that runs after the query like find(), findOne(), etc is executed
  // console.log(docs); // this is the documents that are returned by the query

  try {
    fs.writeFileSync('./log/log.txt', 'hey i am finding', { flag: 'a' }); // this is to write the content to the log.txt file
    console.log('Query has been executed');
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
  next();
});

// aggregation middleware in mongoose
ordersSchema.pre('aggregate', function (next) {
  // this is an aggregation middleware in mongoose that runs before the aggregation is executed
  console.log(this.pipeline().unshift({ $match: { price: { $gt: 5 } } })); // this is to add a $match stage to the beginning of the aggregation pipeline

  console.log('Aggregation is about to be executed');
  next(); // this is to move to the next middleware or the actual aggregation execution
});

const Orders = model('Order', ordersSchema);

export default Orders;
