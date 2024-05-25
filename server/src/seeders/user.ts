import { faker } from '@faker-js/faker';

import { User } from '../models/user';

const createUser = async (userCountGenerate: number) => {
  try {
    const userPromise = [];
    for (let i = 0; i <= userCountGenerate; i++) {
      const tempUsers = User.create({
        name: faker.person.fullName(),
        bio: faker.person.bio(),
        email: faker.internet.email(),
        password: 'hello',
        avatar: {
          public_id: faker.system.fileName(),
          url: faker.image.url(),
        },
      });

      userPromise.push(tempUsers);
    }

    await Promise.all(userPromise)
      .then(() => {
        console.log('Users created:', userCountGenerate);
        // Do something with the created users
      })
      .catch((err) => {
        console.error('Error creating users:', err);
      });
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { createUser };
