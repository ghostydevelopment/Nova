import { Collection, Events, REST, Routes } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import Command from "../../base/classes/Command";

export default class Ready extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: "Ready Event",
      once: true,
    });
  }

  async Execute() {
    console.log(`${this.client.user?.tag} is now online.`);

    const commands: object[] = this.GetJson(this.client.commands);

    const rest = new REST().setToken(this.client.config.token);

    try {
      const setCommands: any = await rest.put(
        Routes.applicationGuildCommands(
          this.client.config.discordClientID, // Changed from discordClientId to discordClientID
          this.client.config.guildId
        ),
        {
          body: commands,
        }
      );

      console.log(`Successfully set ${setCommands.length} commands.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error setting commands:", error.message);
      } else {
        console.error("An unknown error occurred while setting commands");
      }
    }
  }

  private GetJson(commands: Collection<string, Command>): object[] {
    const data: object[] = [];

    commands.forEach((command) => {
      const commandData: any = {
        name: command.name,
        description: command.description,
        options: command.options,
      };

      if (command.default_member_permissions !== undefined) {
        commandData.default_member_permissions =
          command.default_member_permissions.toString();
      }

      if (command.dm_permission !== undefined) {
        commandData.dm_permission = command.dm_permission;
      }

      data.push(commandData);
    });

    return data;
  }
}
