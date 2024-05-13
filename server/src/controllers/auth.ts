import { TryCatch } from '../middlewares/error.js';

const registerUser = TryCatch(async (req, res, next) => {
  const { name, email, password, bio } = req.body;
  console.log(name, email, password, bio);
});

export { registerUser };
