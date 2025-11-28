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
    envs: {}
};