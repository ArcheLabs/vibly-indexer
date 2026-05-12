import type { Store } from "@subql/types-core";
import type { ApiPromise } from "@polkadot/api";
import type { ApiDecoration } from "@polkadot/api/types";

type ApiAt = ApiDecoration<"promise"> & { rpc: ApiPromise["rpc"] };

declare global {
  const store: Store;
  const api: ApiAt;
  const unsafeApi: ApiPromise | undefined;
}

export {};
