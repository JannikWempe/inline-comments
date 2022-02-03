import ksuid from "ksuid";
import { getEnvOrThrow } from "../../utils";
import { docClient } from "../lib/ddb";
import { CreateUserInput } from "../types.generated";

export const createUser = async (input: CreateUserInput) => {
  const Item = {
    id: ksuid.randomSync().string,
    username: input.username,
    postIds: [],
    firstCreated: new Date().toISOString(),
  };

  try {
    await docClient
      .put({
        TableName: getEnvOrThrow("USERS_TABLE_NAME"),
        Item,
      })
      .promise();
    return Item;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
