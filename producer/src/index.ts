import mqConnection from "./connection";
import { sendNotification } from "./notification";

const send = async () => {
  await mqConnection.connect();

  const newNotification = {
    title: "You have received new notification",
    description:
      "You have received new incmoing notification from the producer service",
  };

  sendNotification(newNotification);
};

send();
