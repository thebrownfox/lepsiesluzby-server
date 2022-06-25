import Boom from "@hapi/boom";
import Wreck from "@hapi/wreck"

const protocol = "https://"
const baseUrl = "lepsiesluzby.atlassian.net";
const apiPath = "/rest/api/3";
const apiUrl = protocol + baseUrl + apiPath;
// const baseUrl = "https://lepsiesluzby.atlassian.net/jira/rest/servicedeskapi/request";

const jiraUser = process.env.JIRA_USER || "marek@brencic.sk";
const jiraToken = process.env.JIRA_TOKEN || "LKsFWJnYqTJpullhYolV80D3"

const token = Buffer.from(`${jiraUser}:${jiraToken}`).toString('base64')
const headers = {
    "Authorization": `Basic ${token}`
};

export default {
    getSuggestions: async (request, h) => {
        try {
            const params = `jql=project = SDM  AND component = e-services AND status != "Nový podnet" ORDER BY created DESC&fields=summary,created&maxResults=5`;
            const response = await Wreck.get(`${apiUrl}/search?${params}`);
            return h.response(response);
        } catch (error) {
            return Boom.boomify(error);
        }
    },
    createSuggestions: async (request, h) => {
        try {
            const response = await Wreck.get(baseUrl, {
                headers
            });
            return h.response(response);
        } catch (error) {
            return Boom.boomify(error);
        }
    },
}