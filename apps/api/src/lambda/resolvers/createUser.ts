import ksuid from "ksuid";
import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { CreateUserInput, User } from "../types.generated";

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const Item = {
    id: ksuid.randomSync().string,
    username: input.username,
    postIds: [],
    firstCreated: new Date().toISOString(),
  };

  const params = {
    TableName: getEnvOrThrow("USERS_TABLE_NAME"),
    Item,
  };
  try {
    await docClient.put(params).promise();
    const { postIds, ...user } = Item;
    return { ...user, posts: [] };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
