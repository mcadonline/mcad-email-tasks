# MCAD Email Tasks

> Generate and send daily emails for Online Learning

Supported:

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

## Email Tasks

|     | Task Name                             | When?               | Audience              | Details                                                                                                                            |
| --- | ------------------------------------- | ------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| ☑️  | `canvas-orientation`                  | 1 week before start | Canvas Pilot Students | How initialize MCAD credentials and use Canvas LMS.                                                                                |
|     | `bb-orientation`                      | 1 week before start | OL Students           | How to initialize MCAD credentials and use Blackboard LMS                                                                          |
|     | `canvas-course-open`                  | Sunday before start | Canvas Pilot Students | Course is open and available on Canvas LMS.                                                                                        |
|     | `bb-course-open`                      | Sunday before start | OL Students           | Online course is open and available on Canvas                                                                                      |
|     | `ol-1000-course-open`                 | Sunday before start | OL MA Programs        | Info on starting the OL-1000 Online Programs Orientation course. The OL Programs orientation is 1 week before the semester begins. |
|     | `ce-papercut`                         | 4 days before start | CE Students           | Info on setting up Papercut account.                                                                                               |
|     | `ol-course-registration-confirmation` | Upon registration   | OL Students           | Confirmation that they are registered for an online course                                                                         |

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
$ 
```