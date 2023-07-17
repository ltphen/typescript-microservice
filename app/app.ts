import bodyParser from 'koa-bodyparser';
import Koa from "koa";
import { getConfig } from './config/openapi';
import config from "./config/dotenv";
import helmet from "koa-helmet";
import cors from '@koa/cors';
import handleErrors from './middlewares/handleErrors';
import router from "./routes/routes"

class App {

  protected app: Koa;

  constructor() {
    this.app = new Koa();
  }

  async run() {
    await this.config();
    this.app.listen(config.port);
    this.app.on("error", (err, ctx) => {
      console.log(err.message)
      ctx.body = "Lio test"

    })
    console.log("Listening to port", config.port)
  }

  async config() {

    // Setting up the documentation
    const openapi = await getConfig();
    this.app.use(openapi);


    // Setting up the routes


    this.app
      .use(handleErrors)
      .use(helmet())
      .use(bodyParser())
      .use(cors())
      .use(router.routes())
      .use(router.allowedMethods());


  }


}

export default App;