## Description

A Url Shortener that has:

- [ ] An endpoint to generate a short URL from an existing URL
- [ ] An endpoint that, given the short URL, will redirect to the original URL
- [ ] An endpoint that displays the following information (see example):
  - the original URL
  - the short URL
  - the number of times the URL was visited, broken down for each day in the last 3 days

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test
```

## Sample curls

1. Post to generate a long url.

   `curl --location --request POST 'http://localhost:3000/url/tinyUrl' \ --header 'Content-Type: application/json' \ --data-raw '{ "longUrl": "https://google4.com" }'`

Expected output:
`{ "status": "success", "response": { "longUrl": "https://google4.com", "shortUrl": "xxxxxxx" } }`

2. Post for the same long url, same short url is given back

   `curl --location --request POST 'http://localhost:3000/url/tinyUrl' \ --header 'Content-Type: application/json' \ --data-raw '{ "longUrl": "https://google4.com" }'`

Expected output:

`{ "status": "success", "response": { "longUrl": "https://google4.com", "shortUrl": "xxxxxxx" } }`

3. Post for a different long url but use a short url this time.

   `curl --location --request POST 'http://localhost:3000/url/tinyUrl?shortUrl=HFEMD8I' \ --header 'Content-Type: application/json' \ --data-raw '{ "longUrl": "https://google5.com", "shortUrl": "uwcKR31" }'`

Expected output:
`{ "status": "success", "response": { "longUrl": "https://google5.com", "shortUrl": "xxxxxxy"`
}
}`

4. Post for different long url but use same short url this time.
   `curl --location --request POST 'http://localhost:3000/url/tinyUrl?shortUrl=HFEMD8I' \ --header 'Content-Type: application/json' \ --data-raw '{ "longUrl": "https://google6.com", "shortUrl": "uwcKR31" }'`

`{ "status": "failed", "response": { "details": { "message": "The short url is already taken" } } }`

5. Get long url for a short url
   `curl --location --request GET 'http://localhost:3000/url/tinyUrl?shortUrl=uwcKR31' \ --data-raw ''`

Expected Output:
`{ "status": "success", "response": { "longUrl": "https://google5.com", "shortUrl": "uwcKR31" } }`
