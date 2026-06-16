import { createContext, useContext } from "react";

/** Lets Nav/Footer/links switch pages inside SiteRouter. Defaults to no-op so the
 *  single-page SiteComposer still works unchanged. */
export const NavigationContext = createContext<(slug: string) => void>(() => {});
export const useNavigate = () => useContext(NavigationContext);
