/** @format */

import type {
    Icon,
    ICredentialType,
    INodeProperties,
    IAuthenticateGeneric,
    ICredentialTestRequest,
} from "n8n-workflow";

export class MemidaApi implements ICredentialType {
    name = "memidaApi";

    displayName = 'Memida API';

    icon: Icon = {
        light: "file:../icons/memida.svg",
        dark: "file:../icons/memida.dark.svg",
    };

    documentationUrl = "https://manual.memida.de/docs/category/api/";

    properties: INodeProperties[] = [
        {
            displayName: "Base URL",
            name: "baseUrl",
            type: "string",
            default: "https://api.memida.de/api/v1",
            required: true,
            description: "REST API endpoint of memida",
        },
        {
            displayName: "API Key",
            name: "apiKey",
            type: "string",
            default: "",
            placeholder: "live ************************",
            required: true,
            typeOptions: {
                password: true,
            },
            description:
                "API key generated in the memida api section. You can find the documentation [here](https://manual.memida.de/docs/category/api/).",
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: "generic",
        properties: {
            headers: {
                Auth: "={{$credentials.apiKey}}",
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            method: "GET",
            url: '={{$credentials.baseUrl.replace(/\\/+$/, "") + "/info"}}',
        },
    };
}
