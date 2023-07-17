export type Status = "pending" | "deploying" | "building" | "failed" | "cancelled" | "done"

export type WebhookRequestType = {
    id: number,
    status: Status
}