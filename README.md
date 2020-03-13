# LittleLink

![tests](https://github.com/mihaiblaga89/littlelink/workflows/tests/badge.svg?branch=master)

_It shrinks your link_

#### Stack

- TypeScript
- serverless
- serverless-offline
- mongodb-memory-server
- webpack
- mongoose
- eslint
- jest
- prettier
- husky
- Github Actions
- snyk

#### How-to

1. Add a link

   ```
   POST /hash
   body { url: "example.com" }
   ```

   response

   ```json
   {
     "hash": "fkwKwr"
   }
   ```

2. Get a link by hash

   ```
   GET /url?hash=fkwKwr
   ```

   response

   ```json
   {
     "url": "example.com"
   }
   ```

3. Get the statistics for URL

   ```
   POST /stats/url
   { url: "example.com"}
   ```

   response

   ```json
   {
        "url": "example.com",
        "hashes": ["fkwKwr", "gown2s" ....],
        "ipAddresses": ["1.1.1.1", "8.8.8.8", ....],
        "requests": 1 // how many times this URL has been fetched, regardless of hash
   }
   ```

4. There's a cronjob which will delete unused links in the past year every day at 12.00am.

#### Development

1. clone it
2. run `yarn`
3. rename `.env.example` to `.env`
4. replace the value of `MONGO_URI`

#### Deployment to AWS

1. Make sure you have AWS CLI configured
2. Make sure the AWS IAM user you have configured in AWS CLI has permissions for Lambda, IAM, S3, CloudWatch, API Gateway and CloudFormation
3. Make sure you replaced `MONGO_URI` with a correct one
4. run `sls deploy`. Or change the `deploy-sls` script and run that
