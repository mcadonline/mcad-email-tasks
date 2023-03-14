This readme is to mainly guide on testing our email openers and testing its UI.

How do we run it.
From the source folder, run the following in your terminal.

node opener_tests/index.js

arguments

--open = if you use --open while running the script, the html generated will be opened in your default browser.

Run the following
```
node opener_tests/index.js --open
```

task=<taskName>: This will only run the particular task mentioned, otherwise it will run all the tasks.

There are in total seven task that we can run.
1. ceCourseOpener
2. olCourseConfirmRegistration
3. olCourseGetReady
4. olCourseOpen
5. olWorkshopConfirmRegistration
6. remoteCourseGetReady
7. remoteCourseOpen

For example to run ceCourseOpener.

run: node opener_tests/index.js --open task=ceCourseOpener