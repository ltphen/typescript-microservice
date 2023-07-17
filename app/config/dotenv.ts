import dotenv from "dotenv";
// Set the NODE_ENV to 'development' by default
//process!.env!.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

interface ICredentials {
  port: string;
  databaseURL: string;
  appSecret: string;
  jwtAlgorithm: string;
  jwtAccessExp: number;
  appHost: string;

  api: { prefix: string };

}


const credentials: ICredentials = {
  port: String(process.env.PORT),
  databaseURL: String(process.env.DATABASE_URI),
  appSecret: String(process.env.JWT_SECRET),
  jwtAlgorithm: String(process.env.JWT_ALGO),
  appHost: String(process.env.APP_HOST),
  jwtAccessExp: parseInt(process.env.JWT_ACCESS_TOKEN_EXP_VALUE || ""),
  api: {
    prefix: "/",
  },


};

export default credentials;
