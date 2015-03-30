var Baobab = require('baobab');

var stateTree = new Baobab({
    documents:  [
        {
            "id":1,
            "title": "AAA",
            "text": "Text AAA",
            "active": true,
            "pros":[
                {"title": "PRO1", id:3, level:"primary" },
                {"title": "PRO2", id:4, level:"primary" }
            ],
            "cons":[
                {"title": "CON1", id:5, level:"primary" },
                {"title": "CON2", id:6, level:"primary" }
            ]

        },
        {
            "id": 2,
            "title": "BBBB",
            "text": "TEXT B",
            "active": false,
            "pros":[
            ],
            "cons":[
            ]

        }
    ],

    language: "en",

    alerts: []

},{
    validate: {
        language: 'string',
        documents: [{
            "id": "number",
            "title": "string",
            "text": "string",
            "active": "boolean",
            "pros": [
                {
                    "title": "string",
                    id: "number",
                    level: "string"
                },
            ],
            "cons": [
                {
                    "title": "string",
                    id: "number",
                    level: "string"
                },
            ]

        }],
        alerts : [{
            id: "number",
            title: "string",
            text: "string",
            duration: "number",
            style: "string"
        }]
    }
    }
);

module.exports = stateTree;
