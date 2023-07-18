import dotenv from "dotenv";
// Set the ENV to 'development' by default
//process!.env!.ENV = process.env.ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  // throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

interface ICredentials {
  nodeEnv: string;
  port: string;
  databaseURL: string;
  rabbitMq: string;
  appSecret: string;
  jwtSecret: string;
  jwtAlgorithm: string;
  jwtAccessExp: number;
  appHost: string;

  api: { prefix: string };

}


const credentials: ICredentials = {
  nodeEnv: String(process.env.ENV),
  port: String(process.env.PORT),
  databaseURL: String(process.env.DATABASE_URI),
  rabbitMq: String(process.env.RABBITMQ_CONNECTION),
  appSecret: String(process.env.APP_SECRET),
  jwtSecret: String(process.env.JWT_SECRET),
  jwtAlgorithm: String(process.env.JWT_ALGO),
  appHost: String(process.env.APP_HOST),
  jwtAccessExp: parseInt(process.env.JWT_ACCESS_TOKEN_EXP_VALUE || ""),
  api: {
    prefix: "/",
  },


};

export default credentials;
