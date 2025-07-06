import { internal } from "./_generated/api"
import { httpAction } from "./_generated/server"

// Helper functions:
function decodeBase64(base64: string): string {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return new TextDecoder("utf-8").decode(bytes)
}

function decodeJwt(jwt: string) {
  const base64Url = jwt.split(".")[1]
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  const json = decodeBase64(base64)
  return JSON.parse(json)
}

async function validateRequest(request) {
  // Extract the JWT from the request.
  const jwt = await request.text()
  // INFO: Validate the webhook coming from Kinde here:
  const payload = decodeJwt(jwt)
  const { data, type } = payload

  // Here you can add additional validation of the payload if necessary
  return { type, data }
}

// Defining the webhook handler
export const handleKindeWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request)
  if (!event) {
    return new Response("Error occurred", { status: 400 })
  }

  switch (event.type) {
    case "user.created":
    case "user.updated":
    case "user.authenticated": {
      await ctx.runMutation(internal.users.upsertFromKinde, {
        data: event.data,
      })
      break
    }

    case "user.deleted": {
      break
    }

    default: {
      console.log("ignored Kinde webhook event", event.type)
      break
    }
  }

  return new Response(null, { status: 200 })
})
