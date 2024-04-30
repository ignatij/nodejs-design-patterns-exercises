# Scalable app using API orchestration layer and nginx reverse proxy

## Steps

- run `yarn` to install deps
- run `yarn node nameRandomizer.js` to generate the different json files which would act as static database
- install nginx and consul globally
- run `consul agent -dev` to start the consul server which would act as service registry
- run `nginx -c ${PWD}/nginx.conf` which would start the NGINX reverse proxy
- start the load balancer using `yarn node loadBalancer.js`
- run `curl --location --request GET 'http://localhost:8080/api/people/byFirstName/b'` to ensure that you will receive 502 Bad Gateway as services are not started yet
- start the services using:
  - `yarn node server.js a-d` - will take care of requests (A-D)
  - `yarn node server.js e-p` - will take care of requests (E-D)
  - `yarn node server.js q-z` - will take care of requests (Q-A)
