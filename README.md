# Huginn

> Email templates sent from database queries

## Usage

```js
import huginn from "huginn";
import html from "html-lit";

const data = [
	{ name: "Jerry Seinfeld", email: "jerry@seinfeld.com" },
	{ name: "Elaine Benes", email: "elaine@jpederman.biz" },
	{ name: "George Costanza", email: "artvandelay@totallylegit.com" }
];

huginn({
	data,
	to: ({ name, email }) => `${name} <${email}>`,
	from: "MCAD Online Learning <online@mcad.edu>",
	subject: ({ name }) => `Hey ${name}!`,
	body: ({ courseName }) =>
		html`
			<h1>Hey ${name}</h1>
		`,
	css: `
    h1 {
      font-family: sans-serif;
    }
  `,
	send: true
});
```
