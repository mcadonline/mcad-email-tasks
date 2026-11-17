# MCAD Email Tasks

> Generate and send daily emails for Online Learning

Supported:

## Docker

Install Docker Engine with Compose v2 (or Docker Desktop). No host Node.js
installation is needed. From the repository root:

```sh
cp .env.example .env
mkdir -p tmp
# Edit .env with your database and email service credentials.
docker compose build --pull
docker compose run --rm tasks --help
docker compose run --rm tasks ol-course-get-ready --today 2026-11-17
```

Tasks generate emails without sending them by default. Add `--send` explicitly
to deliver emails. Containers need network access to Jenzabar and the selected
email provider, including any required VPN connection. `localhost` inside Docker
refers to the container; use a reachable database hostname (or
`host.docker.internal` for a service on the Docker Desktop host).

Logs persist in `./tmp`. The container runs as the `node` user (UID 1000); on
Linux, ensure that user can write to this directory. The default timezone is
`America/Chicago` for MCAD; override it with `TZ=America/Toronto docker compose run
--rm tasks ...` when needed. This affects task dates and log timestamps.
The `--preview` option launches a browser and requires a desktop environment;
use it when running locally instead of in the container.

For an interactive development shell with your checkout mounted into `/app`:

```sh
docker compose run --rm dev
# Inside the container:
node cli.js --help
npm test -- --runInBand --runTestsByPath lib/generateEmails.test.js
# Or execute any other repository script with node.
exit
```

Source edits are shared with the host. Linux dependencies live in a separate
Docker volume so host `node_modules` are not used. After dependency changes,
rebuild and refresh that volume with `docker compose run --rm dev npm ci`.
Some tests require a live Jenzabar database; running the entire suite requires
appropriate credentials and network access.

To use the image without Compose:

```sh
docker build --pull -t mcad-email-tasks .
docker run --rm mcad-email-tasks --help
docker run --rm --init --env-file .env -e TZ=America/Chicago \
  -v "$PWD/tmp:/app/tmp" mcad-email-tasks ol-course-get-ready
```

The image contains code and production dependencies. Credentials and host
dependencies are excluded from the build; supply credentials at runtime.

### Node.js and Brotli security

Use Node.js 24.22.1 or later in the 24.x line, including for local and cron
execution (`nvm install && nvm use` reads `.nvmrc`). This minimum includes the
fix for the bundled Brotli decoder vulnerability CVE-2026-111497 described in the
[Node.js security advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).
Updating npm packages alone does not update Node's bundled Brotli decoder.
The Docker build uses the latest Node 24 Debian image and checks this minimum.
Rebuild with `docker compose build --pull` to receive runtime security updates.

## Usage

```sh
mcad-email-tasks <email-name> <options>
```

Example:

```sh
$ mcad-email-tasks canvas-orientation --today 2019-01-15 --send

> Running task: canvasOrientation
> Options: { today: '2019-01-15', preview: true }
> Sending 122 emails...
```

By default emails will not be sent unless you include the `--send` option. This is prevent accidentally sending emails.

### Options

#### `--today <ISO Date>`

Generate emails as if today was given date. This is useful if you want to preview future emails, or resend a batch of emails that may not have sent during server maintenance. Date should be in the format of `2019-01-15`.

#### `--preview`

Opens a preview of the email in the browser.

#### `--send`

Sends the email. The email will not be sent this option is included.

#### `--email-log <email@address.com>`

Sends a log file to a given email address.

## Email Tasks (current and future)

| Done? | Task Name                   | When?               | Audience                                          | Details                                                                     |
| ----- | --------------------------- | ------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- |
| ☑️    | `ol-course-reg-confirm`     | Upon registration   | All OL Students                                   | Confirmation that they are registered for an online course                  |
| ☑️    | `canvas-orientation`        | 1 week before start | OL Canvas Students                                | How initialize MCAD credentials and use Canvas LMS.                         |
| ☑️    | `bb-orientation`            | 1 week before start | OL Bb Students                                    | How to initialize MCAD credentials and use Blackboard LMS                   |
| ☑️    | `canvas-course-open`        | Sunday before start | OL Canvas Students                                | Course is open and available on Canvas LMS.                                 |
| ☑️    | `bb-course-open`            | Sunday before start | OL Bb Students                                    | Online course is open and available on Canvas                               |
| ☑️    | `ce-papercut`               | 4 days before start | CE non-OL Students using Papercut                 | Info on setting up Papercut account.                                        |
| ☑️    | `hybrid-canvas-orientation` | 4 days before start | CE non-OL Students using Canvas, but not Papercut | Info on setting up MCAD account, and reviewing Canvas Orientation Materials |


## Overview of Tasks folder

- `index.js` – the controller for a task. It generates data and a list of emails for the current day (or uses the option `today` if set).
- `subject.hbs` – template for email subject line
- `html.hbs` - template for the HTML body
- `style.css` - CSS styles for the HTML body. Be sure to test this on a variety of browsers.
- `text.hbs` - text-based version of the email

# Deployment

Prerequisites:

- NodeJS
- Linux server supporting Cron

```sh
# ssh into server for deployment
$ ssh james@ol-support.mcad.edu

# clone the repo to ~/dev
$ cd ~/dev
$ git clone git@github.com:mcadonline/mcad-email-tasks.git

# link the ./cli.js so that we can run mcad-email-tasks as
# a command from the command line
$ cd mcad-email-tasks
$ npm link

# setup a .env file
# I like putting all .env files in a single ~/.env folder
# and then linking to them in the git repos
$ mkdir ~/.env/mcad-email-tasks
$ cp ~/dev/mcad-email-tasks/.env.example ~/.env/mcad-email-tasks/.env.production
$ ln -s ~/.env/mcad-email-tasks/.env.production ~/dev/mcad-email-tasks/.env

# test
$ mcad-email-tasks

# setup cron to run mcad-email-tasks nightly at 6:30
# *see crontab file in costanza-cron-scripts repository
```
