# MCAD-Email-tasks

> Daily generated emails for Online Learning

## Usage

```sh
$ mcad-email-tasks

[?] Which Tasks?
* Canvas Orientation Email (7 days before start)
- Canvas Course Open Email (Sunday before start)
- Send Bb Course Open Email (Sunday before start)
- CE Papercut email (4 days before start)

[?] Mock Todays Date?
- No, use the real date.
* Yes

[?] What date should we use for today? (ISO format, please)
2019-01-15

[?] Preview or Send?
* Preview
- Send

> Previewing Canvas Orientation Email that will be send on 2019-01-15...
```

Run a particular task

```sh
$ mcad-email-tasks canvasOrientation --mock-today-as 2019-01-15 --send
> Running task: ./tasks/canvasOrientation/index.js
> With options { mockTodayAs: '2019-01-15', send: true }
```
