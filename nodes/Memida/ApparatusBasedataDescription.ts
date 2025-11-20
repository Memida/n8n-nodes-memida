/** @format */

import type { INodeProperties } from "n8n-workflow";

export const apparatusBasedataNodeProperties: INodeProperties[] = [
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        displayOptions: {
            show: {
                resource: ["apparatusBasedata"],
            },
        },
        options: [
            {
                name: "Get Many",
                value: "getAll",
                description: "Retrieve a list of apparatus basedatas",
                action: "Get many apparatus basedatas",
            },
            {
                name: "Get",
                value: "get",
                description: "Retrieve a single apparatus basedata",
                action: "Get an apparatus basedata",
            },
        ],
        default: "getAll",
        noDataExpression: true,
    },
    {
        displayName: "Apparatus Basedata ID",
        name: "apparatusBasedataId",
        type: "string",
        required: true,
        default: "",
        description: "Identifier of the apparatus basedata to retrieve",
        displayOptions: {
            show: {
                resource: ["apparatusBasedata"],
                operation: ["get"],
            },
        },
    },
    {
        displayName: "Return All",
        name: "returnAll",
        type: "boolean",
        default: false,
        displayOptions: {
            show: {
                resource: ["apparatusBasedata"],
                operation: ["getAll"],
            },
        },
        description:
            "Whether to return all results or only up to a given limit",
    },
    {
        displayName: "Limit",
        name: "limit",
        type: "number",
        default: 50,
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        displayOptions: {
            show: {
                resource: ["apparatusBasedata"],
                operation: ["getAll"],
                returnAll: [false],
            },
        },
        description: "Max number of results to return",
    },
    {
        displayName: "Filters",
        name: "filters",
        type: "collection",
        placeholder: "Add Filter",
        displayOptions: {
            show: {
                resource: ["apparatusBasedata"],
                operation: ["getAll"],
            },
        },
        default: {},
        options: [
            {
                displayName: "Default Only",
                name: "default",
                type: "boolean",
                default: false,
                description:
                    "Whether to limit results to default apparatus basedatas",
            },
            {
                displayName: "Manufacturer ID",
                name: "manufactorId",
                type: "string",
                default: "",
                description: "Filter by manufacturer UUID (manufactor_id)",
            },
            {
                displayName: "Page",
                name: "page",
                type: "number",
                default: 1,
                typeOptions: {
                    minValue: 1,
                },
                description:
                    "Page number to request when not loading all records",
            },
            {
                displayName: "Search",
                name: "search",
                type: "string",
                default: "",
                description:
                    "Search query applied to name, model and description",
            },
            {
                displayName: "Sort By",
                name: "sort",
                type: "options",
                options: [
                    {
                        name: "Created",
                        value: "created",
                    },
                    {
                        name: "Model",
                        value: "model",
                    },
                    {
                        name: "Modified",
                        value: "modified",
                    },
                ],
                default: "created",
                description: "Field used for ordering the list response",
            },
            {
                displayName: "Sort Direction",
                name: "direction",
                type: "options",
                options: [
                    {
                        name: "Ascending",
                        value: "asc",
                    },
                    {
                        name: "Descending",
                        value: "desc",
                    },
                ],
                default: "asc",
                description: "Ascending or descending order for the sort field",
            },
        ],
    },
];
