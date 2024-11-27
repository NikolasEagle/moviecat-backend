import redis from "redis";

const client = redis.createClient();

import { RedisStore } from "connect-redis";

export default new RedisStore({
  client: client,
});
