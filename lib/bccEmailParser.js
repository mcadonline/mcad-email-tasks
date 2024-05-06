import settings from "../settings.js"

function parseBccEmail() {
    let standardEmails = 'MCAD Online Learning <online@mcad.edu>'

    if(settings.salesforce.email) {
        standardEmails = `${standardEmails},${settings.salesforce.email}`;
    }

   return standardEmails;
}

export default parseBccEmail;