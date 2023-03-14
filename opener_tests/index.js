import ceCourseTask from '../tasks/ceCourseGetReady/index.js';
import olCourseConfirmRegistration from '../tasks/olCourseConfirmRegistration/index.js';
import olCourseGetReady from '../tasks/olCourseGetReady/index.js';
import olCourseOpen from '../tasks/olCourseOpen/index.js';
import olWorkshopConfirmRegistration from '../tasks/olWorkshopConfirmRegistration/index.js';
import remoteCourseGetReady from '../tasks/remoteCourseGetReady/index.js';
import remoteCourseOpen from '../tasks/remoteCourseOpen/index.js';
import reportCartChecker from '../tasks/reportCartChecker/index.js';

import jex from '../services/jex.js';
import * as fs from 'fs';
import * as open from 'open';

let mockedData = [{}];
let openFile = false;
let tasks = [
    'ceCourseOpener',
    'olCourseConfirmRegistration',
    'olCourseGetReady',
    'olCourseOpen',
    'olWorkshopConfirmRegistration',
    'remoteCourseGetReady',
    'remoteCourseOpen',
    // 'reportCartChecker' This needs to be handled differently
]

for (let i = 2; i < process.argv.length; i++) {
    const argv = process.argv[i];
    if (argv === '--open') {
        openFile = true;
    } else if (argv.includes('task')) {
        let commaSeperatedtasks = argv.split('=');
        tasks = commaSeperatedtasks[1].split(',');
    }
}

jex.query = async (sql) => {
    return mockedData;
}

const ceCourseOpener = async () => {
    // ceCourse
    mockedData = [{
        firstName: 'Jane',
        lastName: 'Doe',
        personalEmail: 'jan.doe@mcadem.com',
        mcadEmail: 'jan@mcad.com',
        username: 'jandoe'
    }];

    const { emails } = await olCourseConfirmRegistration({ today: '2019-03-21' });
    const { html } = emails[0];

    return html;
}

const olCourseConfirmRegistrationOpener = async () => {
    mockedData = [{
        firstName: 'Jane',
        lastName: 'Doe',
        personalEmail: 'jan.doe@mcadem.com',
        mcadEmail: 'jan@mcad.com',
        username: 'jandoe'
    }];

    const { emails } = await ceCourseTask({ today: '2019-03-21' });
    const { html } = emails[0];

    return html;
}

const olCourseGetReadyOpener = async () => {
    mockedData = [{
        firstName: 'Jane',
        lastName: 'Doe',
        personalEmail: 'jan.doe@mcadem.com',
        mcadEmail: 'jan@mcad.com',
        username: 'jandoe'
    }];

    const { emails } = await olCourseGetReady({ today: '2019-03-21' });
    const { html } = emails[0];

    return html;
}

const olCourseOpenOpener = async () => {
    mockedData = [{
        firstName: 'Jane',
        lastName: 'Doe',
        personalEmail: 'jan.doe@mcadem.com',
        mcadEmail: 'jan@mcad.com',
        username: 'jandoe'
    }];

    const { emails } = await olCourseOpen({ today: '2019-03-21' });
    const { html } = emails[0];

    return html;
}

const olWorkshopConfirmRegistrationOpener = async () => {
    mockedData = [{
        firstName: 'Jane',
        lastName: 'Doe',
        personalEmail: 'jan.doe@mcadem.com',
        mcadEmail: 'jan@mcad.com',
        username: 'jandoe'
    }];

    const { emails } = await olWorkshopConfirmRegistration({ today: '2019-03-21' });
    const { html } = emails[0];

    return html;
}


const remoteCourseGetReadyOpener = async () => {
    mockedData = [{
        firstName: 'Jane',
        lastName: 'Doe',
        personalEmail: 'jan.doe@mcadem.com',
        mcadEmail: 'jan@mcad.com',
        username: 'jandoe'
    }];

    const { emails } = await remoteCourseGetReady({ today: '2019-03-21' });
    const { html } = emails[0];

    return html;
}

const remoteCourseOpenOpener = async () => {
    mockedData = [{
        firstName: 'Jane',
        lastName: 'Doe',
        personalEmail: 'jan.doe@mcadem.com',
        mcadEmail: 'jan@mcad.com',
        username: 'jandoe'
    }];

    const { emails } = await remoteCourseOpen({ today: '2019-03-21' });
    const { html } = emails[0];

    return html;
}

const reportCartCheckerOpener = async () => {
    mockedData = [{
        firstName: 'Jane',
        lastName: 'Doe',
        personalEmail: 'jan.doe@mcadem.com',
        mcadEmail: 'jan@mcad.com',
        username: 'jandoe'
    }];

    const { emails } = await reportCartChecker({ today: '2019-03-21' });
    const { html } = emails[0];

    return html;
}


(async function openEmails() {

    for(let i = 0; i < tasks.length; i++) {
        let currentTask = tasks[i];
        let html = '';

        if (currentTask === 'ceCourseOpener') {
            html = await ceCourseOpener();
        } else if (currentTask === 'olCourseConfirmRegistration') {
            html = await olCourseConfirmRegistrationOpener();
        } else if (currentTask === 'olCourseGetReady') {
            html = await olCourseGetReadyOpener();
        } else if (currentTask === 'olCourseOpen') {
            html = await olCourseOpenOpener();
        } else if (currentTask === 'olWorkshopConfirmRegistration') {
            html = await olWorkshopConfirmRegistrationOpener();
        } else if (currentTask === 'remoteCourseGetReady') {
            html = await remoteCourseGetReadyOpener();
        } else if (currentTask === 'remoteCourseOpen') {
            html = await remoteCourseOpenOpener();
        } else if (currentTask === 'reportCartChecker') {
            html = await reportCartCheckerOpener();
        }

        if (html != '') {
            fs.writeFileSync(`${currentTask}.html`, html);
        }

         if (openFile) {
             await open.default(`${currentTask}.html`, {"wait": false });
         }
    }

    process.exit(1);
})()