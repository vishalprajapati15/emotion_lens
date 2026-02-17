import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({to, subject, text, html})=>{
    try {
        const {data, error} = await resend.emails.send({
            from: `EmotionLens <onboarding@resend.dev>`,
            to,
            subject,
            text: text || "",
            html: html || text
        });

        if(error){
            console.error('Resend Error : ', error);
            throw error;
        }

        console.log("Email sent successfully to : ", to);

        return {success : true, data};

    } catch (error) {
        console.error('Email Send Error:', error.message);
        throw error;
    }
}

export default sendEmail;