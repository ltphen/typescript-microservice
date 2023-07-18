import { EventModel } from "../models/event.model"
import { BodyParams, Event, EventBroadcastType } from "../types/types";

export default class EventController {
    model: EventModel

    constructor() {
        this.model = new EventModel()
    }

    /**
     * Create an event
     * @param param0 Contain the path of the request and the body that we parse to save
     * @param ack Function from amqlib that help to acknowledge the reception of the message
     */
    async createEvent({ path, body }: { path: string, body: any }, ack: Function) {
        console.log(path, body)
        const action = this.inferActionFromPath(path, body);
        if (body) {
        }
        const idFromPath = this.extractIdFromPath(path);
        console.log(idFromPath, path)
        if (idFromPath) {
            body.id = idFromPath;
        }

        let response = await this.model.createEvent({ name: action, payload: { path, body } });
        if (response)
            ack()
    }


    /**
     * Infers an action from a given path and body parameters.
     * @param path A string representing the path of a request.
     * @param bodyParams An object containing parameters from the request body.
     * @returns A string describing the action inferred from the path and body parameters.
     */

    inferActionFromPath(path: string, bodyParams: BodyParams): string {
        if (path.includes("/deployment") && !path.includes("/webhook")) {
            if (path.includes("/cancel")) {
                return "deployment canceled";
            }
            return "deployment creation";
        } else if (path.includes("/webhook")) {
            if (bodyParams.status) {
                return `deployment ${bodyParams.status}`;
            }
        }
        return "unknown action";
    }

    /**
     * Extracts an ID from a given path.
     * @param path A string representing the path of a request.
     * @returns The ID extracted from the path, or null if no ID is found.
     */
    extractIdFromPath(path: string): string | null {
        const id = path.split('/').filter(segment => !isNaN(Number(segment)));
        return id.length > 1 ? id[1] : null;
    }


}