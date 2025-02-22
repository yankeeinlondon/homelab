import chalk from "chalk";
import { CHECK, CROSS } from "~/cli/constants";
import { Pihole } from "~/dns";
import { isError } from "~/type-guards";

import { info, output } from "~/utils";

const address = "dns2.home.ken.net";

const api = await Pihole.authorize(address);

if (isError(api)) {
  info(`${CROSS} failed to authenticate!`);
  info(api);
}
else {
  info(`${CHECK} authenticatated to ${chalk.blue(address)}!`, "");
  const clients = await api.lists.getLists();
  if (clients) {
    info("Clients", "----------------", "");
    output(clients);
  }
}
