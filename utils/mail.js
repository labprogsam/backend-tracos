import axios from 'axios';

const sendEmail = async (templateId, to, params) => {
  try {
    // if (process.env.ENV === 'develop') return true;
    const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', {
      templateId,
      to,
      params,
      headers: {
        "X-Sib-Sandbox": "drop",
      }
    }, {
      headers: {
        'api-key': process.env.SENDINBLUE_API_KEY,
      },
    });
    return response.data;
  } catch (err) {
    console.log('[sendMail]', err);
    return false;
  }
};

const sendRecoveryLink = async (userData, recoveryLink) => {
  const templateId = 1
  return sendEmail(templateId, [userData], {
    NAME: userData.name,
    RECOVERY_LINK: recoveryLink,
  });
};

export {
  sendRecoveryLink,
};
