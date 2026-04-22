import { hash, compare } from 'bcrypt';

async function hashPassword(password) {
    return await hash(password, 10);
}

async function comparePassword(pass1, pass2) {
    return await compare(pass1, pass2);
}

export { hashPassword, comparePassword }