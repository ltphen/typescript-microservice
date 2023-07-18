export type EventBroadcastType = { name: string, payload: object }
export type Status = "pending" | "deploying" | "building" | "failed" | "cancelled" | "done"

export type WebhookRequestType = {
    id: number,
    status: Status
}

export interface BodyParams {
    status?: "pending" | "deploying" | "building" | "failed" | "cancelled" | "done";
    [key: string]: any;
}

export interface Event {
    name: string;
    payload: {
        path: string;
        timestamp: string;
        bodyParams: BodyParams;
    }
}