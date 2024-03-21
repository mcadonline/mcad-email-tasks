import settings from "../settings.js"

function parseBccEmail() {
    let standardEmails = ['MCAD Online Learning <online@mcad.edu>']

    if(settings.salesforce.email) {
        standardEmails = standardEmails.concat(settings.salesforce.email.split(','));
    }

   return standardEmails.join(',');
}

export default parseBccEmail;