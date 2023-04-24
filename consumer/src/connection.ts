import client, { Connection, Channel } from "amqplib";

import { rmqUser, rmqPass, rmqhost, NOTIFICATION_QUEUE } from "./config";

type HandlerCB = (msg: string) => any;

class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;

  async connect() {
    if (this.connected && this.channel) return;

    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);
      this.connection = await client.connect(
        `amqp://${rmqUser}:${rmqPass}@${rmqhost}:5672`
      );

      console.log(`✅ Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      console.log(`🛸 Created RabbitMQ Channel successfully`);

      this.connected = true;
    } catch (error) {
      console.error(error);
      console.error(`Not connected to MQ Server`);
    }
  }

  async consume(handleIncomingNotification: HandlerCB) {
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

          handleIncomingNotification(msg?.content?.toString());

          this.channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;
