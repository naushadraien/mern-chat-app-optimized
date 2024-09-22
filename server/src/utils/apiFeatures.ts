class Apifeatures {
  query: any;
  queryStr: any;

  constructor(query: any, queryStr: any) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter(): this {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['sort', 'fields', 'page', 'limit'];
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    excludeFields.forEach((field) => delete queryObj[field]);

    let filterObj = queryObj;
    if (queryObj.filter && typeof queryObj.filter === 'object') {
      filterObj = { ...queryObj, ...queryObj.filter };
      delete filterObj.filter;
    }

    // Convert filter object to JSON string and replace operators
    let queryString = JSON.stringify(filterObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryString);

    // Apply case-insensitive regex for string fields
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.keys(parsedQuery).forEach((key) => {
      if (typeof parsedQuery[key] === 'string') {
        parsedQuery[key] = { $regex: parsedQuery[key], $options: 'i' };
      }
    });

    // Apply filters to the query
    this.query = this.query.find(parsedQuery);

    return this;
  }

  sort(): this {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields(): this {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate(): this {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default Apifeatures;

// the above implementation will work the query like this: ?filter[email]=email@mail.com&sort=age&fields=name,email&page=2&limit=5

// use of this apifeatures

// import express, { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import Apifeatures from './path/to/Apifeatures';

// const app = express();

// // Define the User schema and model
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   avatar: {
//     url: String,
//   },
// });

// const User = mongoose.model('User', userSchema);

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Route to search for users
// app.get('/search-users', async (req: Request, res: Response) => {
//   try {
//     const features = new Apifeatures(User.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();

//     const users = await features.query;

//     res.json(users);
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// from procademy
// class Apifeatures {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   filter() {
//     let queryString = JSON.stringify(this.queryStr);
//     queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     const queryObj = JSON.parse(queryString);

//     this.query = this.query.find(queryObj);

//     return this;
//   }

//   sort() {
//     if (this.queryStr.sort) {
//       const sortBy = this.queryStr.sort.split(',').join(' ');
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort('-createdAt');
//     }

//     return this;
//   }

//   limitFields() {
//     if (this.queryStr.fields) {
//       const fields = this.queryStr.fields.split(',').join(' ');
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select('-__v');
//     }

//     return this;
//   }

//   paginate() {
//     const page = this.queryStr.page * 1 || 1;
//     const limit = this.queryStr.limit * 1 || 10;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);

//     // if(this.queryStr.page){
//     //     const moviesCount = await Movie.countDocuments();
//     //     if(skip >= moviesCount){
//     //         throw new Error("This page is not found!");
//     //     }
//     // }

//     return this;
//   }
// }

// module.exports = Apifeatures;
