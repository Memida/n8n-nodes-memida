/** @format */

import type {
    IExecuteFunctions,
    IHookFunctions,
    IHttpRequestMethods,
    ILoadOptionsFunctions,
    IDataObject,
    IHttpRequestOptions,
} from "n8n-workflow";

export async function memidaApiRequest(
    this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
    option: IDataObject = {}
) {
    const credentials = await this.getCredentials("memidaApi");

    const options: IHttpRequestOptions = {
        method,
        body,
        qs,
        url: `${(credentials.baseUrl as string).replace(
            /\/+$/,
            ""
        )}${endpoint}`,
        json: true,
    };

    if (Object.keys(body).length === 0) {
        delete options.body;
    }

    if (Object.keys(qs).length === 0) {
        delete options.qs;
    }

    Object.assign(options, option);

    return this.helpers.httpRequestWithAuthentication.call(
        this,
        "memidaApi",
        options
    );
}

export async function memidaApiRequestAllItems(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    propertyName: string,
    method: IHttpRequestMethods,
    endpoint: string,
    // tslint:disable-next-line:no-any
    body: unknown = {},
    query: IDataObject = {}
    // tslint:disable-next-line:no-any
): Promise<IDataObject[]> {
    const returnData: IDataObject[] = [];
    let responseData;
    query.page = 1;
    query.limit = query.limit ?? 100;

    do {
        responseData = await memidaApiRequest.call(
            this,
            method,
            endpoint,
            body as IDataObject,
            query
        );

        query.page++;

        returnData.push(...simplifyResponse(responseData));
    } while (
        responseData.paginator?.pageCount !== undefined &&
        responseData.paginator.page !== undefined &&
        responseData.paginator.page < responseData.paginator.pageCount
    );
    return returnData;
}

export function simplifyResponse(response: unknown): IDataObject[] {
    if (Array.isArray(response)) {
        return response as IDataObject[];
    }

    if (
        typeof response === "object" &&
        response !== null &&
        "data" in response &&
        Array.isArray((response as { data: unknown }).data)
    ) {
        return (response as { data: IDataObject[] }).data;
    }

    return [response as IDataObject];
}
