import client, { Connection, Channel, Message, ConsumeMessage } from "amqplib";
import config from "./../config/dotenv"
import once from "./utils";


/**
 * @var {Promise<MessageBroker>}
 */
let instance: Promise<MessageBroker>;

/**
 * Broker for async messaging
 */
class MessageBroker {
    queues: any;
    private connection?: Connection;
    private channel?: Channel;

    constructor() {
        this.queues = {};
    }

    /**
 * Initializes a connection to the RabbitMQ server and creates a channel
 */
    async init() {
        this.connection = await client.connect(config.rabbitMq);
        this.channel = await this.connection.createChannel();
        return this;
    }

    /**
     * Sends a message to a specified queue
     * @param queue The name of the queue
     * @param msg The message to be sent
     */
    async send(queue: string, msg: string) {
        if (!this.connection) {
            await this.init();
        }
        await this.channel?.assertQueue(queue, { durable: true });
        this.channel?.sendToQueue(queue, Buffer.from(msg));
    }

    /**
     * Subscribes to a queue and sets up a consumer with a message handler
     * @param queue The name of the queue
     * @param handler The function that handles the consumed messages
     */
    async subscribe(queue: string, handler: Function) {
        if (!this.connection) {
            await this.init();
        }
        // Existing handlers management...

        await this.channel?.assertQueue(queue, { durable: true });
        this.queues[queue] = [handler];
        this.channel?.consume(queue, async (msg: any) => {
            const ack = once(() => this.channel?.ack(msg));
            this.queues[queue].forEach((h: Function) => h(msg, ack));
        });
        return () => this.unsubscribe(queue, handler);
    }

    /**
     * Unsubscribes a handler from a queue
     * @param queue The name of the queue
     * @param handler The handler to be unsubscribed
     */
    async unsubscribe(queue: string, handler: Function) {
        this.queues[queue] = this.queues[queue].filter((h: Function) => h !== handler);
    }

    /**
     * Provides a singleton instance of the MessageBroker class
     */
    getInstance = async function () {
        if (!instance) {
            const broker = new MessageBroker();
            instance = broker.init();
        }
        return instance;
    };


    setConnection(connection: Connection) {
        this.connection = connection
    }

    setChannel(channel: Channel) {
        this.channel = channel
        return this;

    }
}

export default MessageBroker;
