import { createContext, useContext } from "react";

/** Lets Nav/Footer/links switch pages inside SiteRouter. Defaults to a no-op so a
 *  standalone single-page render (no router) degrades gracefully. */
export const NavigationContext = createContext<(slug: string) => void>(() => {});
export const useNavigate = () => useContext(NavigationContext);
