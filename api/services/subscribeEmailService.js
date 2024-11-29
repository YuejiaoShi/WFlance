import SubscribeEmail from "../models/subscribeEmail.js";

const subscribeEmail = async (email) => {
  try {
    const emailExists = await SubscribeEmail.findOne({
      where: { email: email },
    });
    if (emailExists) throw new Error("email is already subscribed");

    const createEmail = await SubscribeEmail.create({
      email,
    });
    return createEmail;
  } catch (err) {
    throw new Error("Error subscribing email: " + err.message);
  }
};
export default { subscribeEmail };
