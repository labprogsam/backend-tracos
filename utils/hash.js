import crypto from 'crypto';

const hash = (data, salt) => crypto.pbkdf2Sync(`${data}`, salt, 2030, 64, 'sha512').toString('Hex');

export default hash;
