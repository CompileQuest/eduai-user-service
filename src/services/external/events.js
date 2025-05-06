const EVENTS = {
    USER_SERVICE: {
        USER_CREATED: "user.created",
        USER_UPDATED: "event.user_service.user_updated",
        USER_DELETED: "event.user_service.user_deleted",
    },
    AUTH_SERVICE: {
        USER_LOGGED_IN: "event.auth_service.user_logged_in",
        USER_LOGGED_OUT: "event.auth_service.user_logged_out",
        PASSWORD_RESET: "event.auth_service.password_reset",
    },
    COURSE_SERVICE: {
        COURSE_CREATED: "event.course_service.course_created",
        COURSE_UPDATED: "event.course_service.course_updated",
        COURSE_DELETED: "event.course_service.course_deleted",
    },
    PAYMENT_SERVICE: {
        PAYMENT_SUCCESS: "event.payment_service.payment_success",
        PAYMENT_FAILED: "event.payment_service.payment_failed",
    }
};

export default EVENTS;