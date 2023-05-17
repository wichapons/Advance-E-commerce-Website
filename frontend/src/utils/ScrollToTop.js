import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation(); //get the current path
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return;
}


export default ScrollToTop;