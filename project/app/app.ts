import bodyParser from 'koa-bodyparser';
import Koa from "koa";
import { getConfig } from './config/openapi';
import config from "./config/dotenv";
import helmet from "koa-helmet";
import cors from '@koa/cors';
import handleErrors from './middlewares/handleErrors';
import router from "./routes/routes"
import MessageBroker from "./utils/RabbitMQ";

class App {

  protected app: Koa;
  protected mq: MessageBroker;

  constructor() {
    this.app = new Koa();
    this.mq = new MessageBroker()

  }

  async run() {
    await this.config();
    this.app.listen(config.port);
    this.app.on("error", (err, ctx) => {
      console.log(err.message)
    })
    console.log("Listening to port", config.port)

    console.log("Ready listenning to events")
  }

  async sendEvents() {
    this.app.use((ctx: Koa.Context, next) => {
      if (ctx.method == "POST") {
        console.log(ctx.method, { verb: ctx.request.path, body: ctx.request.body })
        this.mq.send("EVENT", JSON.stringify({ path: ctx.request.path, body: ctx.request.body }))
      }

      return next()
    })
  }
  async config() {

    // Setting up the documentation

    const openapi = await getConfig();
    this.app
      .use(openapi)
      .use(bodyParser());
    await this.sendEvents()


    // Setting up the routes


    this.app
      .use(handleErrors)
      .use(helmet())
      .use(cors())
      .use(router.routes())
      .use(router.allowedMethods());

    return this.app
  }


}

export default App;