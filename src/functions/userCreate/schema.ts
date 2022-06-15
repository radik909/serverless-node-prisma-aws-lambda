import { object, string, number } from 'yup';

export default object({
  name: string().required(),
  age: number().required().positive().integer(),
});
