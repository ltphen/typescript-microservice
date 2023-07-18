import bodyParser from 'koa-bodyparser';
import Koa from "koa";
import { getConfig } from './config/openapi';
import config from "./config/dotenv";
import helmet from "koa-helmet";
import cors from '@koa/cors';
import handleErrors from './middlewares/handleErrors';
import router from "./routes/routes"

import EventController from "./controllers/event.controller";
import MessageBroker from "./utils/RabbitMQ";


class App {

  protected app: Koa;
  protected mq: MessageBroker;
  protected eventController: EventController;

  constructor() {
    this.app = new Koa();
    this.eventController = new EventController();
    this.mq = new MessageBroker()
  }

  async run() {
    await this.config();
    this.app.listen(config.port);
    // this.app.on("error", (err: any, ctx) => {
    //   console.log(err.message)
    // })
    console.log("Listening to port", config.port)

    let instance = await this.mq.init()
    instance.subscribe("EVENT", async (response: any, ack: Function) => {
      let data = JSON.parse(response.content.toString())
      await this.eventController.createEvent(data, ack)
    })
    console.log("Ready listenning to events")

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

    return this.app
  }


}

export default App;