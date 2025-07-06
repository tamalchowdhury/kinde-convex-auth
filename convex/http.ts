import { httpRouter } from "convex/server"
import { handleKindeWebhook } from "./webhook"

const http = httpRouter()

// Configuring the webhook route
http.route({
  path: "/kinde-users-webhook",
  method: "POST",
  handler: handleKindeWebhook,
})

export default http
