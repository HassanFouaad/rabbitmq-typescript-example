import client, { Connection, Channel, ConsumeMessage } from "amqplib";

import { rmqUser, rmqPass, rmqhost, NOTIFICATION_QUEUE } from "./config";

class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);
      this.connection = await client.connect(
        `amqp://${rmqUser}:${rmqPass}@${rmqhost}:5672`
      );

      console.log(`✅ Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      console.log(`🛸 Created RabbitMQ Channel successfully`);

      await this.startListeningToNewMessages();
    } catch (error) {
      console.error(error);
      console.error(`Not connected to MQ Server`);
    }
  }

  async startListeningToNewMessages() {
    await this.channel.assertQueue(NOTIFICATION_QUEUE, {
      durable: true,
    });

    this.channel.consume(
      NOTIFICATION_QUEUE,
      (msg) => {
        {
          if (!msg) {
            return console.error(`Invalid incoming message`);
          }

          handleIncomingNotification(msg);

          this.channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  }

  async sendToQueue(queue: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const handleIncomingNotification = (msg: ConsumeMessage) => {
  try {
    const parsedMessage = JSON.parse(msg?.content?.toString());

    // Implement your own notification flow
  } catch (error) {
    console.error(`Error While Parsing the message`);
  }
};

const mqConnection = new RabbitMQConnection();

export default mqConnection;
