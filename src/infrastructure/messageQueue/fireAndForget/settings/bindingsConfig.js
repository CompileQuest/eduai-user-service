import { RoutingKeys } from "./routingKeys.js";

const bindingsConfig = {
    user_service: {
        exchange: "user_exchange",
        queue: "user_queue",
        bindings: [
            { exchange: "course_exchange", routingKeys: [RoutingKeys.COURSE_CREATED] },
        ],
    }
};


export default bindingsConfig;
