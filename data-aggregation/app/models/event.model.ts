import Model from "./model";
import config from "../config/dotenv"
import { EventBroadcastType } from "./../types/types";


export class EventModel extends Model {

    // deployment status const

    constructor() {
        super()
    }


    /**
     * Asynchronously creates an event in the database.
     * @param data An object of type EventBroadcastType, containing the event's details.
     * @returns A promise that resolves to true if the event creation is successful.
     * @throws An error if there is a problem creating the event.
     */

    async createEvent(data: EventBroadcastType) {
        const returned_id = await this.db(this.tablename).insert({ ...data, created_at: new Date() }).returning('id')
        if (!returned_id)
            throw Error("Error while creating the deployment")
        return true
    }




}