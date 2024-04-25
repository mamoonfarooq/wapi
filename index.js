const Queue = require('better-queue');
const objectHash = require('object-hash');
require('dotenv').config();
const DB_PATH = process.env.DB_PATH || 'db.sqlite';

const { logger } = require('./logger');
const { initDb } = require('./db');
const { createClient, sendMessageAsync } = require('./client');
const { createApp } = require('./app');

const port = process.env.PORT || 4000;

const db = initDb(DB_PATH);
const client = createClient(db);

const isClientConnected = (cb) => {
    client.getState()
        .then((state) => {
            logger.info('isClientConnected: state = ' + state);
            cb(null, state == 'CONNECTED');
        })
        .catch((err) => cb(err, false));
}

const truncateInput = (input) => {
    if (input.attachments) {
        return {
            ...input,
            attachments: input.attachments.map((a) => {
                return {
                    ...a,
                    content: a.content.slice(0, 20) + '...',
                }
            })
        }
    }
    return input;
}

const sendMessage = (input, cb) => {
    logger.info(`sendMessage: ` + JSON.stringify(truncateInput(input)));
    sendMessageAsync(client, input)
        .then(() => { cb(null, true)})
        .catch((err) => { cb(err, false)});
}

const outgoingMessageQueue = new Queue(sendMessage, {
    store: {
        type: 'sqlite',
        dialect: 'sqlite',
        path: DB_PATH,
    },
    precondition: isClientConnected,
    preconditionRetryTimeout: 5000,
    afterProcessDelay: 5000,
    maxRetries: 3, 
    retryDelay: 5000,
    batchDelay: 5000,
    id: function (task, cb) {
        // reduce duplicated message
        const id = objectHash(task);
        cb(null, id);
    },
})


const app = createApp(client, outgoingMessageQueue, db, logger)
app.listen(port, function (err) {
    if (err) logger.error(err)
    logger.info(`Server listening on ${port}...`)
})