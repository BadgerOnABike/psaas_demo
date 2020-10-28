// ./api-v1/paths/config.js
export default function (configService) {
    let operations = {
        GET
    };

    function GET(req, res, next) {
        console.log("Getting config...")
        res.status(200).json(configService.getConfig());
    }

    // NOTE: We could also use a YAML string here.
    GET.apiDoc = {
        summary: 'Returns PSaaS API Config.',
        operationId: 'getConfig',
        // parameters: [
        //     {
        //         in: 'query',
        //         name: 'worldName',
        //         required: true,
        //         type: 'string'
        //     }
        // ],
        responses: {
            200: {
                description: 'The PSaaS Configuration Object.',
                schema: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/Config'
                    }
                }
            },
            default: {
                description: 'An error occurred',
                schema: {
                    additionalProperties: true
                }
            }
        }
    };

    return operations;
}