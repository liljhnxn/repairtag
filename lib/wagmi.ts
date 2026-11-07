import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainMainnet, botchainTestnet } from "./chains";

export const config = createConfig({
  chains: [botchainMainnet, botchainTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http(botchainMainnet.rpcUrls.default.http[0]),
    [botchainTestnet.id]: http(botchainTestnet.rpcUrls.default.http[0]),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
