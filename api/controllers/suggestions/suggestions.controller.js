import Boom from "@hapi/boom";
import Wreck from "@hapi/wreck"

const baseUrl = "https://lepsiesluzby.atlassian.net/jira/rest/servicedeskapi/request";
const token = process.env.JIRA_TOKEN || "RtUW33My"

export default {
    getSuggestions: async (request, h) => {
        try {
            const response = await Wreck.get(baseUrl, {
                headers: {
                    auth: token
                }
            });
            return h.response(response);
        } catch (error) {
            return Boom.boomify(error);
        }
    },
    createSuggestions: false
}