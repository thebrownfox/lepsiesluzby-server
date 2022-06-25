import Hapi from "@hapi/hapi";
import consola from "consola";

import HapiOpenApi from "hapi-openapi";

import openapi from "./api/reference/openapi.json" assert { type: "json" };
import handlers from "./api/controllers/main.handler.js";

const start = async () => {

    const server = new Hapi.Server({
        host: "localhost",
        port: "3100",
    });

    await server.register([
        {
            plugin: HapiOpenApi,
            options: {
                api: openapi,
                handlers,
                docs: {
                    prefixBasePath: false,
                    auth: false,
                },
            },
        },
    ]);

    await server.start();

    // NOTE: This adds message to 500 in non prod environments
    server.ext("onPreResponse", (request, h) => {
        // Transform only server errors
        if (request.response.isBoom && request.response.isServer) {
            const newError = request.response;
            newError.reformat(process.env.NODE_ENV !== "production");
            throw newError;
        }

        // Otherwise just continue with previous response
        return h.continue;
    });

    consola.ready({
        message: `Server running at: ${server.info.uri}`,
        badge: true,
    });

}

process.on("unhandledRejection ", (error) => consola.error(error));

start();
export default start;
