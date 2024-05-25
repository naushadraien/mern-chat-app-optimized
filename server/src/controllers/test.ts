import { TryCatch } from '../middlewares/error';
import Inventory from '../models/testInventory';
import Orders from '../models/testOrders';
import { User } from '../models/user';
import { successData } from '../utils/utility-func';

const getUsersData = TryCatch(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const users = await User.aggregate([
    // Using aggregate pipeline for getting data in a desired form from the database
    {
      $match: {
        // Filtering data by name
        name: 'Rehan',
      },
    },
    {
      $group: {
        // Grouping data by email and getting data in object form instead of array form
        _id: '$email',
        userBio: {
          $first: '$bio',
        },
        userId: {
          $first: '$_id',
        },
        usersCount: {
          $sum: 1,
        },
        bioArray: {
          $push: '$bio',
        },
        userEmail: {
          $first: '$email',
        },
        avatar: {
          $first: '$avatar.url',
        },
        name: {
          $first: '$name',
        },
      },
    },
    {
      $unwind: '$bioArray', // $unwind used for getting data in object form instead of array form like bioArray: ['bio1', 'bio2'] to bioArray: 'bio1' and bioArray: 'bio2'
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    // {
    //   $facet: {
    //     // Using $facet to get multiple outputs from a single stage of the pipeline and then merging them into a single output document
    //     data: [{ $skip: skip }, { $limit: limit }],
    //     totalCount: [{ $count: 'count' }],
    //   },
    // },
    {
      $project: {
        // Projecting data to get only required fields from the database and renaming fields as well if needed. Here 0 means excluding the field and 1 means including the field
        _id: 0,
      },
    },
  ]);

  //   // for seaching of user
  //   const userName = req.query.userName;
  //   const pipeline = [];

  //   if (typeof userName === 'string') {
  //     pipeline.push({
  //       $match: {
  //         userName: {
  //           $regex: new RegExp(userName, 'i'), // Case-insensitive search
  //         },
  //       },
  //     });
  //   }

  //   pipeline.push(
  //     {
  //       $group: {
  //         // Grouping data by email and getting data in object form instead of array form
  //         _id: '$email',
  //         userBio: {
  //           $first: '$bio',
  //         },
  //         userId: {
  //           $first: '$_id',
  //         },
  //         usersCount: {
  //           $sum: 1,
  //         },
  //         bioArray: {
  //           $push: '$bio',
  //         },
  //         userEmail: {
  //           $first: '$email',
  //         },
  //         avatar: {
  //           $first: '$avatar.url',
  //         },
  //         name: {
  //           $first: '$name',
  //         },
  //       },
  //     },
  //     {
  //       $unwind: '$bioArray', // $unwind used for getting data in object form instead of array form like bioArray: ['bio1', 'bio2'] to bioArray: 'bio1' and bioArray: 'bio2'
  //     },
  //     {
  //       $skip: skip,
  //     },
  //     {
  //       $limit: limit,
  //     },
  //     // {
  //     //   $facet: {
  //     //     // Using $facet to get multiple outputs from a single stage of the pipeline and then merging them into a single output document
  //     //     data: [{ $skip: skip }, { $limit: limit }],
  //     //     totalCount: [{ $count: 'count' }],
  //     //   },
  //     // },
  //     {
  //       $project: {
  //         // Projecting data to get only required fields from the database and renaming fields as well if needed. Here 0 means excluding the field and 1 means including the field
  //         _id: 0,
  //       },
  //     }
  //   );

  //   const users = await User.aggregate(pipeline);

  return successData(res, '', users);
});

const createNewOrders = TryCatch(async (req, res, next) => {
  await Orders.create(req.body);

  return successData(res, 'Order created successfully', undefined, true);
});

const getOrdersData = TryCatch(async (req, res, next) => {
  const users = await Orders.aggregate([
    {
      $match: {
        price: {
          $gte: 20,
          $lte: 100,
        },
        quantity: {
          $gte: 4,
          $lte: 100,
          //   $ne: 10
        },
      },
    },
  ]);

  return successData(res, '', users);
});
const createNewInventory = TryCatch(async (req, res, next) => {
  await Inventory.create(req.body);

  return successData(res, 'Inventory created successfully', undefined, true);
});
export { createNewInventory, createNewOrders, getOrdersData, getUsersData };
