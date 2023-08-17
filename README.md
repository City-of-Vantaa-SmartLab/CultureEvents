# Vantaa Culture Reservations

CultureEvents was a project that ran on https://kulttuuriliput.vantaa.fi serving tickets for various culture events. It was shut down on June 2023.

## Architecture

This project is simple client-server application built with

- Frontend: React.js & MobX
- Backend: TypeScript & Nestjs
- Database: PostgreSQL

## Running locally

There are no seeded events in the local database, and these must be created manually in the app's admin view. This in turn requires an admin user to be created on module initialisation. Follow these steps:
- set environment variable `SEED_DB=1` into docker-compose.yml (`ENV SEED_DB=1`) before the npm run script
- also note that since Docker sometimes works completely randomly, the environment variable doesn't always work, so you may just have to edit seed.service.ts temporarily
- inside the file `seed_users.ts`, add an object with properties `username` and `password`, like this:
  export const users = [
    {
      username: "localadmin",
      password: "localadmin"
    }
  ]
- inside the file `seed.service.ts`, uncomment the function call inside the `onModuleInit` method

Also set `DATABASE_HOST`, `NODE_ENV` and `command` as instructed in the file.

_DO NOT DEPLOY THIS MODIFICATION TO PRODUCTION. This will clear the admin users in the production database._

Finally, run `. ./run-locally.sh`

You should see a "Seed users:" prompt if environment variable `SEED_DB` was set correctly.

Once the app is running, you can navigate to `localhost:3000/producer`, log in with the credentials you created inside `seed_users.ts` and create new events. The client facing app can be accessed through path `localhost:3000`.

This local development includes hot reloading on the front-end and the back-end. To test API calls (like payment), use `localhost:5000` which serves a static frontend build.

## Deployment

The application runs in Elastic Beanstalk in Ireland region `eu-west-1`. App environments can be updated using EB CLI tools.

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
4. Select the `kulttuuriliput` as application and `kulttuuriliput-vantaa-dev` as the default environment. Don't continue with CodeCommit (defaults to Y).
5. Ensure the environment is set up by typing `eb list`. You should see that the development environment is selected:

```
kulttuuriliput-vantaa-prod
* kulttuuriliput-vantaa-dev
```

_Note: only committed changes are going to be deployed._

Remember to set the correct environment variables in AWS (e.g. `APP_BASE_URL`).

### Deploy a new version to the development environment

- Run `eb use kulttuuriliput-vantaa-dev` to switch to the development environment
- Run `eb deploy`
- Optionally, to see how things are progressing, run `eb events -f`

### Deploy a new version to the production environment

- Run `eb use kulttuuriliput-vantaa-prod` to switch to the production environment
- Run `eb deploy`
- Optionally, to see how things are progressing, run `eb events -f`
