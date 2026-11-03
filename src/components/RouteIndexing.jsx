import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { privateRoute } from "../lib/indexingPolicy.js";

export default function RouteIndexing() {
  const { pathname } = useLocation();
  useEffect(() => {
    let tag = document.head.querySelector('meta[name="robots"]');
    if (privateRoute(pathname)) {
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "robots"; tag.dataset.routeRobots = "true";
        document.head.appendChild(tag);
      }
      tag.content = "noindex, nofollow";
    } else if (tag?.dataset.routeRobots === "true") {
      tag.remove();
    }
    // El noindex insertado durante una compilación Preview nunca se retira.
  }, [pathname]);
  return null;
}
