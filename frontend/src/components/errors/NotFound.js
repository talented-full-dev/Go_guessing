import React from 'react';
import './notfound.css'
import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();

  return (<div id="main">
  
  <div className="fof">
  <a href="/">
    <h1>Error 404</h1>

  </a>
    <br /><h2>{t("page_not_found")}</h2>

  </div>
</div>
)
}

export default NotFound;