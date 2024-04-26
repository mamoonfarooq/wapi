# 🥗 WAPI

Cloned from [WAPI](https://github.com/yohanesgultom/wapi)

Thanks to [Yohanes Gultom](https://github.com/yohanesgultom) AND [whatsapp-web.js TEAM](https://github.com/pedroslopez/whatsapp-web.js)

Simple REST API wrapper for the super awesome [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)

> ⚠️ Due to the nature of the `whatsapp-web.js` dependency on WhatsApp Web behaviours, regular maintainance is required (library update, temporary workaround). If you face any unknown issue that is not fixed in this wrapper, consider checking [whatsapp-web.js issue page](https://github.com/pedroslopez/whatsapp-web.js/issues)

support of [google-libphonenumber](https://www.npmjs.com/package/google-libphonenumber) is added and some minor changes.

docker removed

[issue resolved](https://github.com/pedroslopez/whatsapp-web.js/issues/2861)


## ⚙️ Setup

1. Clone repo
2. Copy `.env.example` to `.env` and set desired `user` & `password` (for Basic Authentication) and `port` (for API server)
3. Run `npm install`
	ON Error "deprecated puppeteer@13.7.0: < 18.1.0 is no longer supported"
	Run `node node_modules/puppeteer/install.js`
4. Run `npm start`

## 🍱 API

All APIs require [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) using the `user` & `password` in `.env`:

1. **GET** `/`

    Health check

1. **GET** `/qr`

    Get authentication QR code image

1. **GET** `/contacts/:contactId`

    Get contact details by id .eg `6281311525264@c.us`


1. **POST** `/send`

    Send a message to an individual or group chat (`number` can contain phone number with country code or a group id). `attachments`. But when provided, the `content` must be base64-encoded.
    Example:

        {
          "number":"6288290764816",
          "message":"Hello world 🙏",
          "attachments": [{"filename": "hello.txt", "mime":"text/plain", "content":"aGVsbG8K"}],
		  "cc": "DE"  //country-code 
        }
		
	`cc` is optional. if provided phone number will be formated using [google-libphonenumber](https://www.npmjs.com/package/google-libphonenumber)
	
  
1. **GET** `/groups`

    Get list of groups (id and name) where this account is included

1. **GET** `/webhooks`

    Get all webhooks

1. **POST** `/webhooks`

    Add a webhook:
    Example:

        {
            "postUrl": "http://localhost:4000/test",
            "authHeader": "Basic c2VjcmV0Cg==",
            "eventCode": "INCOMING_MESSAGE"
        }

1. **DELETE** `/webhooks/:id`

    Delete a webhook
