export const config = {
    testnet: {
        nildb: {
            nodes: [
                "https://nildb-stg-n1.nillion.network",
                "https://nildb-stg-n2.nillion.network",
                "https://nildb-stg-n3.nillion.network",
            ]
        },
        nilchain: {
            endpoint: "http://rpc.testnet.nilchain-rpc-proxy.nilogy.xyz"
        },
        nilauth: {
            endpoint: "https://nilauth.sandbox.app-cluster.sandbox.nilogy.xyz"
        }
    },
    envs: {
        thresholdDemo: {
            builderPk: "1ce2a82a51bfedb409cb42efff3b4b029e885ac3bdfda4dbb2e12d86c024c163",
            builderDid: "did:nil:02d88354f4dd6baeb043cd4f231a50513cb6a05eff1eda02e8e3903b204a1c1de2",
            thresholdCollectionId: "3ecf4451-53f6-447f-9018-c95ecacff70c",
            userPk: "404d9429e0d515e350908357fdf10000f179b43ea00d766ac4ec9e89ed2439f7",
            schema: {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "title": "Threshold Secret Sharer Demo Schema",
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                    "_id": {
                        "type": "string",
                        "format": "uuid",
                        "coerce": true
                    },
                    "name": {
                        "type": "string"
                    },
                    "secret": {
                        "type": "object",
                        "properties": {
                        "%share": {
                            "type": "string"
                        }
                        },
                        "required": [
                        "%share"
                        ]
                    }
                    },
                    "required": [
                    "_id",
                    "name",
                    "secret"
                    ]
                }
            }
        }
    }
};