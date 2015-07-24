#CatchCrypt

CatchCrypt is a simple API (and user interface) that allows users to upload files, and then share a link which can be used by anyone to download those files. Files are stored encrypted.

##Features
1. All files are stored encrypted using aes-256-CTR (configurable)
2. All links expire after 24 hours (configurable)
3. Users can optionally provide a password when they upload files, and this password will be required when attemping to download the file using the generated link
4. Passwords are salted/hashed
5. The API has a testing suite to verify that it works
6. Files are stored using the local filesystem, and a simple MongoDB database is used to keep track of stored files and their associated passwords
7. Files are limited to a maximum size of 5mb (configurable)

##Installation
1. [Install Node.js] (https://nodejs.org/)
2. [Install MongoDB] (https://www.mongodb.org/downloads)
3. Clone this repo
4. Change the encryption password in 'encryptionPassword.js'
5. Modify the settings in 'config.js' to your liking
6. Run `npm install` inside the local directory to install all dependencies
7. Run MongoDB by executing `mongod` inside your terminal (ensure that the MongoDB address specified in the config files corresponds to your MongoDB server)
8. Run the API server by executing `node server.js`
9. Thats it! You should be up and running, try executing `npm test` inside your local directory to see if everything is working properly

##Testing
1. Make sure MongoDB and the API server are running as described in steps 5 and 6 of the installation process
2. Inside the local directory execute `npm test`
![](https://github.com/richardartoul/CatchCrypt/blob/master/documentation/testsExample.png)

##Scalability
As the API currently stands, the entire process is completely self-contained in one server/process. This is great as an MVP because its very easy to test, debug, and deploy quickly. However, to make the API more scalable, the codebase would need to be divided into separate processes. For example. one process might handle authentication, another would handle encryption / decryption of files, another would handle actually serving links and it might have an additional layer of caching for frequently accessed files.

Another problem that would need to be solved in terms of scalability is distributing the filesystem. While many DB's have built-in features for sharding across many servers, this feature is not native to unix file-systems. There are several ways this problem could be tackled. One option would be to have all uploads routed through a central load-balancer. This server would equally distribute files among many other servers and would also store a database of meta-data that tracks which server each file is located on. Another option would be to use an existing distributed filesystem solution like [seaweedfs](https://github.com/chrislusf/seaweedfs) or a storage-as-a-service cloud solution like Amazon S3.

##Resiliency
CatchCrypt handles resiliency in two different ways:
1. Error handling: All errors are delegated to a specific error handling function which console logs the error (in production an actual logger would be installed) and sends the client a status code 500 response. This error handling could be expanded upon a lot, but this MVP solution accomplishes two things: First, the client is notified that an error took place and can take corrective action to minimize detriment to the users experience. Second,since all errors are delegated to this function automatically, the servers are protected from isolated errors and will not crash allowing other users to continue using the API

2. Testing Suite: CatchCrypt employs a simple testing suite (there is a lot of room for more tests to be added) that checks to make sure that all the basic functionality of the API is working properly. Constantly writing new tests as features are added, and making sure that old tests are still passing, goes a long way towards providing the API with resiliency as many issues with the codebase can be caught automatically before deployment.

##Improvements/TODO
1. Manage folder permissions so that files that are uploaded never get executed / generally investigate security of storing user files on server
2. Investigate what happens if the server receives many simultaneous file uploads, even if they're small. The server temporarily stores fileuploads in memory (so that the buffer can be encrypted before writing to disk) --- will it crash if a 1000 people try and upload a file at the same time?
3. Add legitimate logging functionality instead of console logging
4. Links expire after 24 hours, but files remain stored in filesystem. A feature should be implemented to remove the files from the filesystem after 24 hours (something like a cronjob would suffice).
5. Convert UI to a legitimate single-page application (and improve styling of course)
6. Use a UUID generator to generate short unique ids for each file so that the links can be made shorter (right now the unique ids are simply the ids generated by MongoDb)
7. Improve error handling to be more robust
8. Address scalability issues described in scalability section
9. Expand the testing suite to be much more robust: does the API handle all different types of files? Does the API properly reject files that are too large? Will the server crash if too many files are being uploaded at the same time?
10. General additional features: break large files into smaller parts automatically, allow bulk uploading of multiple files, user accounts with file permission management / analytics, etc etc
