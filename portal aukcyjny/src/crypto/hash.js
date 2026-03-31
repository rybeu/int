const crypto = require('crypto');


function getSalt() {
    if (!process.env.SALT) {
        throw new Error('SALT is missing');
    }

    const salt = Buffer.from(process.env.SALT.trim(), 'hex');

    if (salt.length !== 16) {
        throw new Error(`SALT must be 16 bytes, got ${salt.length}`);
    }

    return salt;
}

function hashPassword(password) {
    const salt = getSalt();
    return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password, stored) {
    return crypto.scryptSync(password, getSalt(), 64).toString('hex') === stored;
}

module.exports = { hashPassword, verifyPassword };
