[![Memida & n8n](/assets/n8n_x_memida.png)](https://memida.de)

# memida n8n Community Node

This repository contains an n8n Community Node that integrates the memida API into n8n workflows.

## Installation

1. Clone the repository and install the dependencies:

   ```bash
   npm install
   npm run build
   ```

2. Install the generated `n8n-nodes-memida` package through the [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/install/) dialog.

## Available resources

- **Inspection**
  - `Get`: Loads a single inspection by its ID (`GET /inspections/{id}`).
  - `Get Many`: Uses the inspection list endpoint (`GET /inspections`) and exposes the documented filters together with `returnAll`/`limit` pagination controls.
  - `Create`: Creates a new inspection (`POST /inspections`) including optional custom fields and file uploads.

- **Apparatus**
  - `Get`: Loads a single apparatus by its ID (`GET /apparatuses/{id}`).
  - `Get Many`: Uses the apparatus list endpoint (`GET /apparatuses`) with available filters and pagination support through `returnAll`/`limit`.
  - `Get by Identno`: Retrieves a single apparatus by its identno (`GET /apparatuses/ident/{identno}`).

- **Apparatus Basedata**
  - `Get`: Loads a single apparatus basedata record by its ID (`GET /apparatus_basedatas/{id}`).
  - `Get Many`: Uses the apparatus basedata list endpoint (`GET /apparatus_basedatas`) with the documented filters and `returnAll`/`limit` pagination controls.

### Inspection filters

The `Filters` collection on the **Get Many** operation maps 1:1 to the available query string parameters in the memida inspection index:

- `sort` – field used to order the list response.
- `direction` – order of the sorting (`asc` or `desc`).
- `page` – page number (default `1`).
- `apparatus_id` – filter inspections of a specific apparatus.

### Apparatus filters

The **Get Many** operation exposes these query string parameters from the memida API:

- `sort` – field used to order the list response.
- `direction` – order of the sorting (`asc` or `desc`).
- `page` – page number (default `1`).
- `search` – query applied to apparatus fields (minimum length 3 characters).

### Apparatus basedata filters

The **Get Many** operation exposes the following query string parameters from the memida API:

- `limit` – number of items per page (default `20`, max `100`).
- `page` – page number (default `1`).
- `sort` – field used to order the list response (`model`, `created`, `modified`).
- `direction` – order of the sorting (`asc` or `desc`).
- `manufactor_id` – filter basedata records for a specific manufacturer.
- `search` – search in the `name`, `model` and `description` fields.
- `default` – when set to `true`, only default apparatus basedata records are returned.

Refer to the API documentation if additional parameters are introduced in the future.

## Credentials

All operations require memida API credentials:

- **Base URL** – Defaults to `https://api.memida.de/api/v1`.
- **API Key** – A valid API key from the memida api section.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [memida API](https://manual.memida.de/docs/category/api/)
* [memida Documentation](https://manual.memida.de/en/docs/introduction/)
