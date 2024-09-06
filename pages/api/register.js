import fetch from 'node-fetch';

const sleep = () => new Promise(resolve => {
    setTimeout(() => {
        resolve(true);
    }, 350);
});

export default async function handler(req, res) {
    const { body, method } = req;

    const { name, email, captchaValue } = body;

    if (method === 'POST') {

        if (!name || !email || !captchaValue) {
            return res.status(422).json({
                message: 'Unprocessable request, please provide the required fields',
            });
        }

        try {
            const response = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaValue}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    },
                    method: 'POST',
                }
            );
            const captchaValidation = await response.json();

            if (captchaValidation.success) {

                await sleep();

                return res.status(200).send("OK");

            } 

            return res.status(422).json({
                message: 'Captcha validation failed',
            });
        } catch (error) {
            console.log('Error :: ', error);
            return res.status(422).json({ message: 'Something went wrong' });
        }
    }
    
    return res.status(404).send('Not found');
}