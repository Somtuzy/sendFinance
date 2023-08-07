import Redis from 'ioredis';
import pino from "pino";

const logger = pino()
const client = new Redis();

export { client, logger };