import Boom from "@hapi/boom";
import Wreck from "@hapi/wreck"

const baseUrl = "https://lepsiesluzby.atlassian.net";
const apiPath = "/rest/api/3";
const apiUrl = baseUrl + apiPath;
const sdApiPath = "/rest/servicedeskapi";
const sdApiUrl = baseUrl + sdApiPath;
// const baseUrl = "https://lepsiesluzby.atlassian.net/jira/rest/servicedeskapi/request";

const jiraUser = process.env.JIRA_USER || "marek@brencic.sk";
const jiraToken = process.env.JIRA_TOKEN;

const token = Buffer.from(`${jiraUser}:${jiraToken}`).toString('base64')
const headers = {
    "Authorization": `Basic ${token}`
};

const fieldPrefix = "customfield_";

const fields = {
    category: fieldPrefix + 10038,
    name: fieldPrefix + 10040,
    phone: fieldPrefix + 10047,
    email: fieldPrefix + 10042,
    url: fieldPrefix + 10048
}

const sd = {
    id: 4,
    types: {
        issue: 19,
        idea: 20
    }
}
const issueType = {
    issue: "Bug",
    idea: "New Feature"
}
export default {
    getSuggestions: async (request, h) => {
        try {
            const params = `jql=project = SDM  AND component = e-services AND status != "Nový podnet" ORDER BY created DESC&fields=summary,created,${fields.category}&maxResults=5`;
            const { payload } = await Wreck.get(`${apiUrl}/search?${params}`);
            return h.response(payload);
        } catch (error) {
            return Boom.boomify(error);
        }
    },
    createSuggestions: async (request, h) => {
        try {
            const createPayload = (data) => {
                const newPayload = {
                    fields: {
                        project: {
                            key: "SDM",
                        },
                        issuetype: {
                            name: issueType[data.type],
                        },
                        summary: data.summary,
                        description: data.description,
                        components: [
                            {
                                name: "e-services",
                            },
                        ],
                        [fields.email]: data.email.toLowerCase(),
                        [fields.name]: data.name || "",
                        [fields.phone]: data.phone || "",
                        [fields.url]: data.url || "",
                    },
                }

                return newPayload
            }

            const { payload } = await Wreck.post(`${apiUrl}/issue`, {
                headers,
                payload: createPayload(request.payload)
            });
            return h.response(payload);
        } catch (error) {
            return Boom.boomify(error);
        }
    },
}