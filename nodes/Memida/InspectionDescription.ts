/** @format */

import type { INodeProperties } from "n8n-workflow";

export const inspectionNodeProperties: INodeProperties[] = [
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        displayOptions: {
            show: {
                resource: ["inspection"],
            },
        },
        options: [
            {
                name: "Get Many",
                value: "getAll",
                description: "Retrieve a list of inspections",
                action: "Get many inspections",
            },
            {
                name: "Get",
                value: "get",
                description: "Retrieve a single inspection",
                action: "Get an inspection",
            },
            {
                name: "Create",
                value: "create",
                description: "Create a new inspection",
                action: "Create an inspection",
            },
        ],
        default: "getAll",
        noDataExpression: true,
    },
    {
        displayName: "Inspection ID",
        name: "inspectionId",
        type: "string",
        required: true,
        default: "",
        description: "Identifier of the inspection to retrieve",
        displayOptions: {
            show: {
                resource: ["inspection"],
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
                resource: ["inspection"],
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
                resource: ["inspection"],
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
                resource: ["inspection"],
                operation: ["getAll"],
            },
        },
        default: {},
        options: [
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
            {
                displayName: "Apparatus ID",
                name: "apparatusId",
                type: "string",
                default: "",
                description: 'Filter inspections that belong to a specific apparatus (apparatus_id)',
            },
        ],
    },
    {
        displayName: "Type",
        name: "type",
        type: "string",
        default: "calibration",
        description:
            "Inspection type. Accepts the documented enum values (other, calibration, repair, inspection, decision) or the UUID of a master data inspection type.",
        displayOptions: {
            show: {
                resource: ["inspection"],
                operation: ["create"],
            },
        },
    },
    {
        displayName: "Apparatus ID",
        name: "apparatusId",
        type: "string",
        required: true,
        default: "",
        description: 'UUID of the apparatus that the inspection belongs to (apparatus_id)',
        displayOptions: {
            show: {
                resource: ["inspection"],
                operation: ["create"],
            },
        },
    },
    {
        displayName: "Inspection Result",
        name: "inspectionResult",
        type: "options",
        options: [
            {
                name: "Conditionally Operational",
                value: "conditionally_operational",
            },
            {
                name: "Decommissioned",
                value: "decommissioned",
            },
            {
                name: "Defect",
                value: "defect",
            },
            {
                name: "Not Operational",
                value: "not_operational",
            },
            {
                name: "Operational",
                value: "operational",
            },
            {
                name: "Operational After Intervention",
                value: "operational_after_intervention",
            },
            {
                name: "Recovered",
                value: "recovered",
            },
            {
                name: "Scrapped",
                value: "scrapped",
            },
            {
                name: "See PDF",
                value: "see_pdf",
            },
            {
                name: "See Report",
                value: "see_report",
            },
            {
                name: "Undetectable",
                value: "undetectable",
            },
        ],
        required: true,
        default: "operational",
        description: 'Result state of the inspection',
        displayOptions: {
            show: {
                resource: ["inspection"],
                operation: ["create"],
            },
        },
    },
    {
        displayName: "Checked At",
        name: "checkedAt",
        type: "dateTime",
        required: true,
        default: "",
        description: 'Datetime of the inspection (ISO 8601)',
        displayOptions: {
            show: {
                resource: ["inspection"],
                operation: ["create"],
            },
        },
    },
    {
        displayName: "Report",
        name: "report",
        type: "string",
        typeOptions: {
            rows: 2,
        },
        default: "",
        description: 'Optional report text for the inspection',
        displayOptions: {
            show: {
                resource: ["inspection"],
                operation: ["create"],
            },
        },
    },
    {
        displayName: "Custom Fields",
        name: "customFields",
        type: "json",
        default: "",
        description:
            "JSON object keyed by custom field IDs. Fields that are marked as required on memida must be provided.",
        displayOptions: {
            show: {
                resource: ["inspection"],
                operation: ["create"],
            },
        },
    },
    {
        displayName: "Attachments",
        name: "attachments",
        type: "fixedCollection",
        placeholder: "Add Attachment",
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        options: [
            {
                name: "attachment",
                displayName: "Attachment",
                values: [
                    {
                        displayName: "Binary Property",
                        name: "binaryProperty",
                        type: "string",
                        default: "data",
                        description: 'Name of the binary property that holds the file to upload',
                    },
                ],
            },
        ],
        displayOptions: {
            show: {
                resource: ["inspection"],
                operation: ["create"],
            },
        },
        description:
            "Files to attach to the inspection. Each entry references a binary property on the input item.",
    },
];
