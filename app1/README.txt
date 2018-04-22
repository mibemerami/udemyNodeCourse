
A node based server with REST API.

Start is like this:
ENV_DATA=staging node index.js

Configuration Options can be defined in the file
config.js

Certificates for HTTPS can be placed in the folder
./https/

Examples for a test:

curl -X PUT -H 'lotti: kasi' -d 'herlitzdareck fielnam derndli alvas' http://localhost:3000/sample?helm=hut

curl -k -X PUT -H 'lotti: kasi' -d 'herlitzdareck fielnam derndli alvas' https://localhost:3001/sample?helm=hut

curl -X POST -H 'lotti: kasi' -d '{"firstName":"flabedi", "lastName":"flubb", "phone":"123654", "password":"sekret", "tosAgreement":true}' http://localhost:3000/users?helm=hut
