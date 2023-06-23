const test = require('../functions/testsControl.js')

test(
    {
        "query": {
            "action": "debug"
        },
        "headers": {
            "X-Envoy-External-Address": [
                "200.181.33.155"
            ],
            "X-Forwarded-Client-Cert": [
                "By=spiffe://xgen-prod/ns/baas-prod/sa/baas-main;Hash=c68c5aa61293af7317ce95a81111deb355d7f6acdfabeb775e95a468d14f947a;Subject=\"O=MongoDB\\, Inc.,CN=lb-b\";URI=spiffe://xgen-prod/ns/vm-prod/sa/lb-b"
            ],
            "User-Agent": [
                "PostmanRuntime/7.32.3"
            ],
            "X-Forwarded-Proto": [
                "https"
            ],
            "Content-Length": [
                "30"
            ],
            "X-Request-Id": [
                "ecae4330-2cf6-4870-9f75-343603e1af24"
            ],
            "X-Cluster-Client-Ip": [
                "200.181.33.155"
            ],
            "Content-Type": [
                "text/plain"
            ],
            "Accept": [
                "*/*"
            ],
            "Accept-Encoding": [
                "gzip, deflate, br"
            ],
            "X-Forwarded-For": [
                "200.181.33.155"
            ],
            "Postman-Token": [
                "5fce5244-884c-4e12-96f5-62885e7626bd"
            ]
        },
        "body": {
            "Subtype": 0,
            "Data": "ewogICAgImxvZ2luIjoiY2FybG9zZW1pbGlvIgp9"
        }
    }
);

console.log("Teste!")