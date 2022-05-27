# NodeJS-Twitch-Game-App

## Local setup
To test everything locally without installing any software. Use docker.

Steps to run app locally:
1. First make sure that you have **docker** and **docker compose** installed locally in your machine.
2. Then cmd this project in you terminal.
3. Create a **.env** file with all the variables present in env.example file and it's values. This will be used by our app container started by docker compose.
4. Create a **postgres.env** file with **POSTGRES_PASSWORD** env variable. This will be used by postgres container started by docker compose.
5. Run command ```docker-compose up --build -d```.
6. Then follow the steps mentioned in **Typeorm Run Migrations** Section.
7. Now you can test the API endpoints by going to ```http://localhost:300/api-explorer```

## Local Testing Endpoints
Swagger is integrated to test endpoints. Follow below steps to open swagger
1. Go to browser
2. Type url ```http://localhost:3000/api-explorer```
3. You can now see the swagger page for testing server endpoints.

**NOTE - For testing endpoints from server just replace ```http://localhost:3000``` with either ```https://<server ip>:<server port>``` or with the ```https://<domain name of the service>```.**

## Typeorm Migration Configuration
This is helpful when generating and running migrations for different database.
Like local, development, staging, production.

Steps to change configutaion of typeorm:
1. Open ormconfig.json file present at root project directory.
2. To change the database url by modifying ```url``` key of the JSON object.
3. To change the database for which to generate migration, modify ```database``` key of JSON object.

## Typeorm Generate Migrations
This guide will help you to generate migrations for 
Steps to generate typeorm migrations
1. Run this command to generate migrations ```npm run typeorm:migrations_generate <name of new migration file>```.

## Typeorm Run Migrations
This guilde will help you to run generated migrations in DB.
Step to run typeorm migrations
1. Run this command to run the generated migrations ```npm run typeorm:migrations_run```.


# Improvements and next steps
Congratulations if you're reading this, you've made to the end.

Here I will discuss future plans and improvements, which we can make to further improve this project making it more maintainable and easy to setup.

1. We should implement rate limiting based on ip or api token. This will prevent security attacks to bring down the service. Also this should not be done at app level, this is something which should be done at server level, like configuring nginx service to do this.
2. We can use an automation flow to test the code and only allow it to be mergeable when all test passes and code coverage is greater than or equal to a certain number, most preferably 80-90% of lines covered.
3. We can use another automation flow for linting and merging changes to a certain branch. Eg - Development, Staging, Master.
4. We can use CI/CD pipeline to deploy code to a cloud service.
5. We can use docker swarm or kubernetes orchestration to manage deployment of all the services/containers in an isolated environment and easy to scale. We can also integrate this with CI/CD pipeline.