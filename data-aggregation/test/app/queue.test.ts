import MessageBroker from './../../app/utils/RabbitMQ';


let mockChannel: any = {
    assertQueue: jest.fn().mockResolvedValue(""),
    sendToQueue: jest.fn(),
    consume: jest.fn(),
    ack: jest.fn(),
};


let mockConnection: any = {
    createChannel: jest.fn().mockResolvedValue(mockChannel),
};


describe('MessageBroker', () => {
    let broker: MessageBroker;


    beforeEach(() => {
        broker = new MessageBroker();
        broker.setConnection(mockConnection);
        broker.setChannel(mockChannel);
    });

    it('should send a message to a queue', async () => {
        const queue = 'testQueue';
        const msg = 'testMessage';

        await broker.send(queue, msg);

        expect(mockChannel.assertQueue).toHaveBeenCalledWith(queue, { durable: true });
        expect(mockChannel.sendToQueue).toHaveBeenCalledWith(queue, Buffer.from(msg));
    });

    it('should subscribe to a queue and call the handler', async () => {
        const queue = 'testQueue';
        const handler = jest.fn();
        const mockMsg = { content: Buffer.from('testMessage') };

        mockChannel.consume.mockImplementation((queue: string, callback: Function) => callback(mockMsg));

        const unsubscribe = await broker.subscribe(queue, handler);

        expect(mockChannel.assertQueue).toHaveBeenCalledWith(queue, { durable: true });
        expect(handler).toHaveBeenCalledWith(mockMsg, expect.any(Function));
        expect(unsubscribe).toEqual(expect.any(Function));
    });

    it('should unsubscribe from a queue', async () => {
        const queue = 'testQueue';
        const handler = jest.fn();

        await broker.subscribe(queue, handler);
        await broker.unsubscribe(queue, handler);

        expect(broker.queues[queue]).toEqual([]);
    });
});