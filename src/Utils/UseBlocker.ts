import { UNSAFE_NavigationContext } from "react-router-dom";
import { useContext, useEffect} from 'react';
import { Blocker, History, Transition } from "history";

export default function useBlocker(blocker: Blocker, when = true, allowedRoutes: Array<string>): void {
    const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

    useEffect(() => {
        if (!when) return;
        const unblock = navigator.block((tx: Transition) => {
            const autoTx = {
                ...tx,
                retry: () => {
                    unblock();
                    tx.retry();
                }
            };
            let found: Boolean = false;
            allowedRoutes.forEach((route) => {
                console.log(route, tx.location.pathname);
                if (tx.location.pathname.includes(route)) {
                    found = found || true;
                }
            });
            console.log(found);
            if (found) {
                autoTx.retry();
            } else {
                blocker(autoTx);
            }
        });
        return unblock;
    }, [navigator, blocker, when, allowedRoutes]);
}
