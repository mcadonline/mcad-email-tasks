import settings from "../settings.js"

function parseBccEmail() {
    let standardEmails = ['MCAD Online Learning <online@mcad.edu>']

    if(settings.salesforce.email) {
        standardEmails = [settings.salesforce.email, 'MCAD Online Learning <online@mcad.edu>']
    }

   return standardEmails.join(',');
}

export default parseBccEmail;