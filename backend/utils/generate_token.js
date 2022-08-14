import Jwt from 'jsonwebtoken';

const generate_token = (id) => {
    return Jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '2h'
    });
}

export default generate_token