/** @format */

import type { INodeProperties } from "n8n-workflow";

export const apparatusNodeProperties: INodeProperties[] = [
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        displayOptions: {
            show: {
                resource: ["apparatus"],
            },
        },
        options: [
            {
                name: "Get Many",
                value: "getAll",
                description: "Retrieve a list of apparatuses",
                action: "Get many apparatuses",
            },
            {
                name: "Get",
                value: "get",
                description: "Retrieve a single apparatus",
                action: "Get an apparatus",
            },
            {
                name: "Get by Identno",
                value: "getByIdentno",
                description: "Retrieve a single apparatus by its identno",
                action: "Get an apparatus by identno",
            },
        ],
        default: "getAll",
        noDataExpression: true,
    },
    {
        displayName: "Apparatus ID",
        name: "apparatusId",
        type: "string",
        required: true,
        default: "",
        description: "Identifier of the apparatus to retrieve",
        displayOptions: {
            show: {
                resource: ["apparatus"],
                operation: ["get"],
            },
        },
    },
    {
        displayName: "Identno",
        name: "identnoId",
        type: "string",
        required: true,
        default: "",
        description: "Identification number of the apparatus to retrieve",
        displayOptions: {
            show: {
                resource: ["apparatus"],
                operation: ["getByIdentno"],
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
                resource: ["apparatus"],
                operation: ["getAll"],
            },
        },
        description: 'Whether to return all results or only up to a given limit',
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
                resource: ["apparatus"],
                operation: ["getAll"],
                returnAll: [false],
            },
        },
        description: 'Max number of results to return',
    },
    {
        displayName: "Filters",
        name: "filters",
        type: "collection",
        placeholder: "Add Filter",
        displayOptions: {
            show: {
                resource: ["apparatus"],
                operation: ["getAll"],
            },
        },
        default: {},
        options: [
            {
                displayName: "Search",
                name: "search",
                type: "string",
                default: "",
                description:
                    "Search query applied to multiple apparatus fields. Minimum length 3 characters.",
            },
            {
                displayName: "Sort By",
                name: "sort",
                type: "string",
                default: "",
                description: 'Field used for ordering the list response',
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
                default: "desc",
                description: 'Ascending or descending order for the sort field',
            },
            {
                displayName: "Page",
                name: "page",
                type: "number",
                default: 1,
                typeOptions: {
                    minValue: 1,
                },
                description: 'Page number to request when not loading all records',
            },
        ],
    },
];
