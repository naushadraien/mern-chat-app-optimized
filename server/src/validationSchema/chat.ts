import { z } from 'zod';

const chatValidation = {
  NewGroup: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    members: z
      .string({
        required_error: 'Members are required',
        invalid_type_error: 'Members must be array of string',
      })
      .array()
      .min(2, {
        message: 'At least two members needed',
      }),
    // pangu: z
    //   .object({ //this is for array of object
    //     name: z.string({required_error: 'Name is required'}),
    //   })
    //   .array(),
  }),
  AddMembers: z.object({
    chatId: z.string({
      required_error: 'ChatId is required',
      invalid_type_error: 'ChatId must be a string',
    }),
    members: z
      .string({
        required_error: 'Members are required',
        invalid_type_error: 'Members must be array of string',
      })
      .array(),
  }),
  RemoveMember: z.object({
    chatId: z.string({
      required_error: 'ChatId is required',
      invalid_type_error: 'ChatId must be a string',
    }),
    userId: z.string({
      required_error: 'UserId is required',
      invalid_type_error: 'UserId must be a string',
    }),
  }),
};

export default chatValidation;
