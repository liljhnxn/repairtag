import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainMainnet } from "./chains";

export const config = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http(botchainMainnet.rpcUrls.default.http[0]),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
