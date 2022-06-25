import controller from "./suggestions.controller.js";

export default {
    get: controller.getSuggestions,
    post: controller.createSuggestion
}