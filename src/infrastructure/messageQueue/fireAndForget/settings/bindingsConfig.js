import { RoutingKeys } from "./routingKeys.js";

const bindingsConfig = {
    user_service: {
        exchange: "user_exchange",
        queue: "user_queue",
        bindings: [
            { exchange: "webhook_exchange", routingKeys: [RoutingKeys.PAYMENT_SESSION_COMPLETED] },
        ],
    }
};


export default bindingsConfig;
