import axios from 'axios';
const PhoneNumber = require('awesome-phonenumber');

const teliaEndPoint = 'https://ws.mkv.telia.fi/restsms/lekabrest/send';
const teliaUsername = process.env.TELIA_USERNAME;
const teliaPassword = process.env.TELIA_PASSWORD;
const teliaUser = process.env.TELIA_USER;

export class SMSService {
  async sendMessageToUser(phoneNumber, user, message) {
    try {
      const formattedPhoneNumber = new PhoneNumber(phoneNumber, 'FI');
      phoneNumber = formattedPhoneNumber.getNumber();
      console.log(`Sending sms for user ${user} to number ${phoneNumber}`);
      const request = this.generateTeliaMessageRequest(phoneNumber, message);
      const response = await axios.post(teliaEndPoint, request);
      if (
        response &&
        response.data.accepted[0].to === phoneNumber.replace(/\s/g, '').slice(1)
      ) {
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.log(`Failed to send sms to the user: ${error.message}`);
      throw new Error(`Sms functionality failed: ${error.message}`);
    }
  }

  generateTeliaMessageRequest = (phoneNumber, message) => {
    return {
      username: teliaUsername,
      password: teliaPassword,
      from: teliaUser,
      to: [phoneNumber],
      message: message,
    };
  };
}
