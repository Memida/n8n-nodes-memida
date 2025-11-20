/** @format */

import type {
    IBinaryKeyData,
    IExecuteFunctions,
    IDataObject,
    INodeProperties,
    INodeType,
    INodeExecutionData,
    INodeTypeDescription,
    IBinaryData,
} from "n8n-workflow";
import { ApplicationError, NodeOperationError } from "n8n-workflow";

import {
    memidaApiRequest,
    memidaApiRequestAllItems,
    simplifyResponse,
} from "./GenericFunctions";
import { apparatusBasedataNodeProperties } from "./ApparatusBasedataDescription";
import { apparatusNodeProperties } from "./ApparatusDescription";
import { inspectionNodeProperties } from "./InspectionDescription";

export class Memida implements INodeType {
    description: INodeTypeDescription = {
        displayName: "Memida",
        name: "memida",
        icon: "file:../../icons/memida.svg",
        usableAsTool: true,
        group: ["transform"],
        version: 1,
        subtitle:
            '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: "Interact with the memida API",
        defaults: {
            name: "Memida",
        },
        inputs: ["main"],
        outputs: ["main"],
        credentials: [
            {
                name: "memidaApi",
                required: true,
            },
        ],
        properties: [
            {
                displayName: "Resource",
                name: "resource",
                type: "options",
                noDataExpression: true,
                options: [
                    {
                        name: "Inspection",
                        value: "inspection",
                    },
                    {
                        name: "Apparatus",
                        value: "apparatus",
                    },
                    {
                        name: "Apparatus Basedata",
                        value: "apparatusBasedata",
                    },
                ],
                default: "inspection",
            },

            // ----------------------------------------
            //              inspection
            // ----------------------------------------
            ...inspectionNodeProperties,

            // ----------------------------------------
            //              apparatus
            // ----------------------------------------
            ...apparatusNodeProperties,

            // ----------------------------------------
            //              apparatus basedata
            // ----------------------------------------
            ...apparatusBasedataNodeProperties,
        ] as INodeProperties[],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];

        const resource = this.getNodeParameter("resource", 0) as string;
        const operation = this.getNodeParameter("operation", 0) as string;

        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === "inspection") {
                    if (operation === "get") {
                        const inspectionId = this.getNodeParameter(
                            "inspectionId",
                            i
                        ) as string;

                        const responseData = await memidaApiRequest.call(
                            this,
                            "GET",
                            `/inspections/${inspectionId}`
                        );

                        returnData.push(responseData as IDataObject);
                    } else if (operation === "getAll") {
                        const returnAll = this.getNodeParameter("returnAll", i);
                        const filterValues = this.getNodeParameter(
                            "filters",
                            i,
                            {}
                        ) as IDataObject;
                        const qs: IDataObject = {};

                        const filterKeyMap: Record<string, string> = {
                            apparatusId: "apparatus_id",
                        };

                        for (const [key, value] of Object.entries(
                            filterValues
                        )) {
                            if (value === undefined) {
                                continue;
                            }

                            if (
                                typeof value === "string" &&
                                value.trim() === ""
                            ) {
                                continue;
                            }

                            const apiKey = filterKeyMap[key] ?? key;
                            qs[apiKey] = value;
                        }

                        if (!returnAll) {
                            const limit = this.getNodeParameter(
                                "limit",
                                i
                            ) as number;
                            qs.limit = limit;
                        }

                        let inspections;

                        if (returnAll) {
                            inspections = await memidaApiRequestAllItems.call(
                                this,
                                "data",
                                "GET",
                                "/inspections",
                                {},
                                qs
                            );
                        } else {
                            const response = await memidaApiRequest.call(
                                this,
                                "GET",
                                "/inspections",
                                {},
                                qs
                            );

                            inspections = simplifyResponse(response);

                            const limit = this.getNodeParameter(
                                "limit",
                                i
                            ) as number;
                            if (inspections.length > limit) {
                                inspections = inspections.slice(0, limit);
                            }
                        }

                        returnData.push(...inspections);
                    } else if (operation === "create") {
                        const type = this.getNodeParameter("type", i) as string;
                        const apparatusId = this.getNodeParameter(
                            "apparatusId",
                            i
                        ) as string;
                        const inspectionResult = this.getNodeParameter(
                            "inspectionResult",
                            i
                        ) as string;
                        const checkedAt = this.getNodeParameter(
                            "checkedAt",
                            i
                        ) as string;
                        const report = this.getNodeParameter(
                            "report",
                            i,
                            ""
                        ) as string;
                        const customFieldsParam = this.getNodeParameter(
                            "customFields",
                            i,
                            ""
                        ) as IDataObject | string;
                        const attachments = this.getNodeParameter(
                            "attachments",
                            i,
                            {}
                        ) as IDataObject;

                        const body: IDataObject = {
                            type,
                            apparatus_id: apparatusId,
                            inspection_result: inspectionResult,
                            checked_at: checkedAt,
                        };

                        if (report !== undefined && report !== "") {
                            body.report = report;
                        }

                        let parsedCustomFields: IDataObject | undefined;
                        if (typeof customFieldsParam === "string") {
                            if (customFieldsParam.trim() !== "") {
                                try {
                                    parsedCustomFields = JSON.parse(
                                        customFieldsParam
                                    ) as IDataObject;
                                } catch {
                                    throw new NodeOperationError(
                                        this.getNode(),
                                        "Custom Fields must be valid JSON."
                                    );
                                }
                            }
                        } else if (
                            customFieldsParam &&
                            Object.keys(customFieldsParam).length > 0
                        ) {
                            parsedCustomFields = customFieldsParam;
                        }

                        if (parsedCustomFields) {
                            body.customFields = parsedCustomFields;
                        }

                        const attachmentEntries = (attachments.attachment ??
                            []) as IDataObject[];

                        const formData: IDataObject = {};

                        const setFormField = (key: string, value: unknown) => {
                            if (value === undefined || value === null) {
                                return;
                            }

                            if (
                                key === "customFields" &&
                                typeof value === "object"
                            ) {
                                for (const [
                                    fieldKey,
                                    fieldValue,
                                ] of Object.entries(value as IDataObject)) {
                                    formData[`customFields[${fieldKey}]`] =
                                        fieldValue as IDataObject;
                                }
                                return;
                            }

                            formData[key] = value as IDataObject;
                        };

                        for (const [key, value] of Object.entries(body)) {
                            setFormField(key, value);
                        }

                        const files: IDataObject[] = [];
                        const itemBinary = (items[i].binary ??
                            {}) as IBinaryKeyData;
                        for (const attachment of attachmentEntries) {
                            const binaryPropertyValue =
                                attachment.binaryProperty;

                            let binaryPropertyName: string | undefined;
                            let binaryPropertyData: IBinaryData | undefined;

                            if (typeof binaryPropertyValue === "string") {
                                const trimmedName = binaryPropertyValue.trim();
                                if (trimmedName === "") {
                                    continue;
                                }
                                binaryPropertyName = trimmedName;
                                binaryPropertyData = itemBinary[
                                    binaryPropertyName
                                ] as IBinaryData;
                            } else if (
                                typeof binaryPropertyValue === "object" &&
                                binaryPropertyValue !== null
                            ) {
                                binaryPropertyData =
                                    binaryPropertyValue as IBinaryData;
                                for (const [name, data] of Object.entries(
                                    itemBinary
                                )) {
                                    if (data === binaryPropertyValue) {
                                        binaryPropertyName = name;
                                        break;
                                    }
                                }
                            } else {
                                continue;
                            }

                            if (!binaryPropertyData) {
                                const displayName =
                                    typeof binaryPropertyValue === "string"
                                        ? binaryPropertyValue
                                        : "[object Object]";
                                throw new NodeOperationError(
                                    this.getNode(),
                                    `Binary property "${displayName}" does not exist on item ${i}.`
                                );
                            }

                            let data: Buffer;
                            if (binaryPropertyName) {
                                data = await this.helpers.getBinaryDataBuffer(
                                    i,
                                    binaryPropertyName
                                );
                            } else if (binaryPropertyData.data) {
                                const encoding = binaryPropertyData.encoding;
                                if (
                                    typeof encoding === "string" &&
                                    Buffer.isEncoding(encoding)
                                ) {
                                    data = Buffer.from(
                                        binaryPropertyData.data,
                                        encoding
                                    );
                                } else {
                                    data = Buffer.from(
                                        binaryPropertyData.data,
                                        "base64"
                                    );
                                }
                            } else {
                                throw new NodeOperationError(
                                    this.getNode(),
                                    "Unable to resolve binary data for attachment."
                                );
                            }

                            const fileName =
                                binaryPropertyData.fileName ??
                                `${binaryPropertyName ?? "file"}.bin`;
                            const mimeType =
                                binaryPropertyData.mimeType ??
                                "application/octet-stream";

                            files.push({
                                value: data,
                                options: {
                                    filename: fileName,
                                    contentType: mimeType,
                                },
                            });
                        }

                        if (files.length > 0) {
                            files.forEach((file, index) => {
                                formData[`files[${index}]`] = file;
                            });
                        }

                        const responseData = (await memidaApiRequest.call(
                            this,
                            "POST",
                            "/inspections",
                            {},
                            {},
                            {
                                formData,
                                json: false,
                            }
                        )) as IDataObject;

                        returnData.push(responseData);
                    } else {
                        throw new ApplicationError(
                            `The operation "${operation}" is not supported.`
                        );
                    }
                } else if (resource === "apparatus") {
                    if (operation === "get") {
                        const apparatusId = this.getNodeParameter(
                            "apparatusId",
                            i
                        ) as string;

                        const responseData = await memidaApiRequest.call(
                            this,
                            "GET",
                            `/apparatuses/${apparatusId}`
                        );

                        returnData.push(responseData as IDataObject);
                    } else if (operation === "getByIdentno") {
                        const identnoId = this.getNodeParameter(
                            "identnoId",
                            i
                        ) as string;

                        const responseData = await memidaApiRequest.call(
                            this,
                            "GET",
                            `/apparatuses/identno/${identnoId}`
                        );

                        returnData.push(responseData as IDataObject);
                    } else if (operation === "getAll") {
                        const returnAll = this.getNodeParameter("returnAll", i);
                        const filterValues = this.getNodeParameter(
                            "filters",
                            i,
                            {}
                        ) as IDataObject;

                        const qs: IDataObject = {};

                        for (const [key, value] of Object.entries(
                            filterValues
                        )) {
                            if (value === undefined) {
                                continue;
                            }

                            if (
                                typeof value === "string" &&
                                value.trim() === ""
                            ) {
                                continue;
                            }

                            qs[key] = value;
                        }

                        if (!returnAll) {
                            const limit = this.getNodeParameter(
                                "limit",
                                i
                            ) as number;
                            qs.limit = limit;
                        }

                        let apparatuses;

                        if (returnAll) {
                            apparatuses = await memidaApiRequestAllItems.call(
                                this,
                                "data",
                                "GET",
                                "/apparatuses",
                                {},
                                qs
                            );
                        } else {
                            const response = await memidaApiRequest.call(
                                this,
                                "GET",
                                "/apparatuses",
                                {},
                                qs
                            );

                            apparatuses = simplifyResponse(response);

                            const limit = this.getNodeParameter(
                                "limit",
                                i
                            ) as number;
                            if (apparatuses.length > limit) {
                                apparatuses = apparatuses.slice(0, limit);
                            }
                        }

                        returnData.push(...apparatuses);
                    } else {
                        throw new ApplicationError(
                            `The operation "${operation}" is not supported.`
                        );
                    }
                } else if (resource === "apparatusBasedata") {
                    if (operation === "get") {
                        const apparatusBasedataId = this.getNodeParameter(
                            "apparatusBasedataId",
                            i
                        ) as string;

                        const responseData = await memidaApiRequest.call(
                            this,
                            "GET",
                            `/apparatus_basedatas/${apparatusBasedataId}`
                        );

                        returnData.push(responseData as IDataObject);
                    } else if (operation === "getAll") {
                        const returnAll = this.getNodeParameter("returnAll", i);
                        const filterValues = this.getNodeParameter(
                            "filters",
                            i,
                            {}
                        ) as IDataObject;

                        const qs: IDataObject = {};

                        const filterKeyMap: Record<string, string> = {
                            manufactorId: "manufactor_id",
                        };

                        for (const [key, value] of Object.entries(
                            filterValues
                        )) {
                            if (value === undefined) {
                                continue;
                            }

                            if (
                                typeof value === "string" &&
                                value.trim() === ""
                            ) {
                                continue;
                            }

                            const apiKey = filterKeyMap[key] ?? key;
                            qs[apiKey] = value;
                        }

                        if (!returnAll) {
                            const limit = this.getNodeParameter(
                                "limit",
                                i
                            ) as number;
                            qs.limit = limit;
                        }

                        let basedatas;

                        if (returnAll) {
                            basedatas = await memidaApiRequestAllItems.call(
                                this,
                                "data",
                                "GET",
                                "/apparatus_basedatas",
                                {},
                                qs
                            );
                        } else {
                            const response = await memidaApiRequest.call(
                                this,
                                "GET",
                                "/apparatus_basedatas",
                                {},
                                qs
                            );

                            basedatas = simplifyResponse(response);

                            const limit = this.getNodeParameter(
                                "limit",
                                i
                            ) as number;
                            if (basedatas.length > limit) {
                                basedatas = basedatas.slice(0, limit);
                            }
                        }

                        returnData.push(...basedatas);
                    } else {
                        throw new ApplicationError(
                            `The operation "${operation}" is not supported.`
                        );
                    }
                } else {
                    throw new ApplicationError(
                        `The resource "${resource}" is not supported.`
                    );
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: (error as Error).message });
                    continue;
                }
                throw error;
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
