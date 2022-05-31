# Vantaa Culture Reservations

## Architecture

This project is simple client-server application built with

- Frontend: React.js & MobX
- Backend: TypeScript & Nestjs
- Database: PostgreSQL

It integrates to Grynos to get the information about current courses available in Vantaa.

---

## Running locally

The local development is set up using docker. Docker is a containerization that help shipping application easy, and without the hassle of installing many many things. We highly recommend you install docker.

By default, Docker compose won't install dev dependencies inside the containers, so this needs to be done
manually first:

```
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

Next, log in to AWS account `vantaa-pwa` and navigate to Elastic Beanstalk on `eu-west-1` region.
Go to Environments > `kulttuuriliput-dev` > Configuration, and click the Edit button of the Software
category. Populate the environment variables inside `docker-compose.yml` with values from the environment
configuration. For `PAYMENT_NOTIFY_URL` and `PAYMENT_RETURN_URL`, substitute `localhost:3000` for the
Elastic Beanstalk domain.

There are no seeded events in the local database, and these must be created manually in the app's admin view. This in turn requires an admin
user to be created on module initialisation. Follow these steps:

- set environment variable `SEED_DB=1` into Dockerfile (`ENV SEED_DB=1`) before the npm run script
  - note that the variable will be written to ./backend/.env so remove it from there also if no seeding is needed later on
  - also note that since Docker sometimes works completely randomly, the environment variable doesn't always work, so you may just have to edit seed.service.ts temporarily \o/
- inside the file `seed_users.ts`, add an object with properties `username` and `password`, like this:
  export const users = [
    {
      username: "localadmin",
      password: "localadmin"
    }
  ]
- inside the file `seed.service.ts`, uncomment the function call inside the `onModuleInit` method

_DO NOT DEPLOY THIS MODIFICATION TO PRODUCTION. This will clear the admin users in the production database._

Finally, run

```
. ./run-locally.sh
```

You should see a "Seed users:" prompt if environment variable `SEED_DB` was set correctly.

Once the app is running, you can navigate to `localhost:3000/producer`, log in with the credentials you created inside `seed_users.ts` and create new events. The client facing app can be accessed through path `localhost:3000`.

This local development includes hot reloading on the front-end and the back-end.

---

## Deployment

The application runs in `vantaa-pwa` AWS account's Elastic Beanstalk in Ireland region `eu-west-1`. App
environments can be updated using EB CLI tools:

Install the tools (for quick setup, follow the README in GitHub):

- [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)
- [GitHub](https://github.com/aws/aws-elastic-beanstalk-cli-setup)
- Remember to add EB CLI to PATH (e.g. `export PATH="/home/username/.ebcli-virtual-env/executables:$PATH"`).

Configure the EB CLI:

- [AWS docs](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html)
- Note: this process only initializes the current directory/repository on your computer. The relevant files have been added to gitignore.

1. Go to project directory root (where this file is). Type: `eb init`.
2. Select `eu-west-1` as the location (unless something's been changed).
3. If you haven't set up your AWS credentials yet, provide your personal Access key ID and Secret access key. These can be generated in the AWS IAM console.
   - Be sure to use the credentials for the correct account, since they determine where the app will be deployed!
4. Select the `kulttuuriliput` as application and `kulttuuriliput-dev` as the default environment. Don't continue with CodeCommit (defaults to Y).
5. Ensure the environment is set up by typing `eb list`. You should see that the development environment is selected:

```
kulttuuriliput
* kulttuuriliput-dev
```

_Note: only committed changes are going to be deployed._

### Deploy a new version to the development environment

- Run `eb use kulttuuriliput-dev` to switch to the development environment
- Run `eb deploy`
- Optionally, to see how things are progressing, run `eb events -f`

### Deploy a new version to the production environment

- Run `eb use kulttuuriliput-prod` to switch to the production environment
- Run `eb deploy`
- Optionally, to see how things are progressing, run `eb events -f`

---

## API documentation

Swagger has been configured to get the api details.

Navigate to the below url to get the api details.

http://localhost:5000/swagger

The UML for the database is CultureAppUML.vsdx, located in backend folder. Last updated June 10th using Microsoft Visio. Remember to update the UML and last update time whenever the db structure change
