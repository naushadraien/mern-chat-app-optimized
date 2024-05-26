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

    // {
    //   $project: {
    //     price: 1,
    //     quantity: 1,
    //     priceAndQuantity: {
    //       $add: ['$price', '$quantity'],
    //     },
    //     multiplyOfPriceWithQuantity: {
    //       $multiply: ['$price', '$quantity'],
    //     },
    //   },
    // },
    // {
    //   $group: {
    //     _id: null,
    //     ordersTotal: {
    //       $sum: '$price',
    //     },
    //     averagePrice: {
    //       $avg: '$price',
    //     },
    //     minPrice: {
    //       $min: '$price',
    //     },
    //     maxPrice: {
    //       $max: '$price',
    //     },
    //     countDocuments: {
    //       $sum: 1,
    //     },
    //     sumOfPriceAndQuantity: {
    //       $sum: '$priceAndQuantity',
    //     },
    //   },
    // },

    // {
    //   $group: {
    //     _id: '$name',
    //     sizeArray: {
    //       $push: '$size',
    //     },
    //   },
    // },

    /* This is example with explanation for lookup aggregation

The $lookup stage in MongoDB performs a left outer join to another collection in the same database to filter in documents from the "joined" collection for processing. 
Here's what each field means:

from: This is the name of the collection you want to join with. This is the "foreign" collection.

localField: This is the field from the documents in the collection on which the aggregation pipeline is being run (the "local" collection). This field is compared with the foreignField to find matching documents.

foreignField: This is the field from the documents in the from collection. This field is compared with the localField to find matching documents.

as: This is the name of the new array field to add to the input documents. This array field contains the matching documents from the from collection.

    // For example, let's say you have two collections: orders and products.
    // Each document in the orders collection has a productId field that corresponds to the _id field in the products collection.
    // You can use the $lookup stage in an aggregation pipeline on the orders collection to include the corresponding product information in each order:

    //     {
    //   $lookup: {
    //     from: 'products', // Join with the "products" collection
    //     localField: 'productId', // Use the "productId" field in the "orders" collection
    //     foreignField: '_id', // Match it against the "_id" field in the "products" collection
    //     as: 'productInfo', // Add the matching product documents to a new "productInfo" field
    //   },
    // }

    // In this example, the orders collection is the local collection, and the products collection is the foreign collection.
    // The from field is set to 'products' to specify that we want to join with the products collection.

    */

    {
      $group: {
        _id: '$size',
        orderId: {
          $first: '$_id',
        },
      },
    },
    {
      $addFields: {
        // Adding new fields to the output document
        orderSize: '$_id', // Adding new field orderSize to the output document and assigning value of _id to it from the previous stage i.e group stage where _id is the size
      },
    },
    {
      $project: {
        _id: 0, // Excluding _id field from the output document
      },
    },
    {
      $lookup: {
        // lookup is mainly used in mongodb to populate the data from another collection in the same database
        // Joining two collections using lookup and getting data from both collections in a single object. This performs a left outer join to an unsharded collection in the same database to filter in documents from the “joined” collection for processing.
        from: 'inventories', // Collection name from which data is to be fetched and can be the same name as the collection stored in the database
        localField: 'orderId', // Field from the input documents
        foreignField: '_id', // Field from the documents of the "from" collection
        as: 'inventory_id', // Output array field
      },
    },
    {
      // after lookup we get the data in the form of array so we need to unwind it to get the data in object form
      $unwind: '$inventory_id', // Deconstructing the array field from the input documents to output a document for each element. Here inventory_id is the array field that is to be deconstructed
    },
  ]);

  return successData(res, '', users);
});
const createNewInventory = TryCatch(async (req, res, next) => {
  await Inventory.create(req.body);

  return successData(res, 'Inventory created successfully', undefined, true);
});

const getExtraOrderManipulation = TryCatch(async (req, res, next) => {
  const orders = await Orders.aggregate([
    {
      $match: {
        price: {
          $gte: 20,
          $lte: 400,
        },
        quantity: {
          $gte: 10,
          $lte: 100,
        },
      },
    },
    {
      $addFields: {
        totalPrice: {
          $multiply: ['$price', '$quantity'],
        },
      },
    },
    {
      $group: {
        _id: null,
        priceAndQuantity: {
          $push: '$totalPrice',
        },
        price: {
          $first: '$price',
        },
      },
    },
    {
      $project: {
        _id: 0,
        price: 1,
        priceAndQuantity: 1,
        totalReducedprice: {
          $reduce: {
            input: '$priceAndQuantity',
            initialValue: '$price',
            in: {
              $multiply: ['$$value', '$$this'],
            },
          },
        },
        totalMappedPrice: {
          $map: {
            input: '$priceAndQuantity',
            as: 'item',
            in: {
              $multiply: ['$price', '$$item'],
            },
          },
        },
        totalFilteredPrice: {
          $filter: {
            input: '$priceAndQuantity',
            as: 'item',
            cond: {
              $gte: ['$$item', '$price'],
            },
          },
        },
      },
    },
  ]);
  return successData(res, '', orders);
});
export {
  createNewInventory,
  createNewOrders,
  getExtraOrderManipulation,
  getOrdersData,
  getUsersData,
};
