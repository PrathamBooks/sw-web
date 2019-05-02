import React from 'react';
import { translate } from 'react-polyglot';


const NoResults = translate()(({ t }) => (
    <span>
        <p>{t("global.no-result-warning-1")}</p>
        <p>{t("global.no-result-warning-2")}</p>
        <ul>
            <li>{t("global.no-result-warning-3")}</li>
            <li>{t("global.no-result-warning-4")}</li>
            <li>{t("global.no-result-warning-5")}</li>
            <li>{t("global.no-result-warning-6")}</li>
        </ul>
    </span>
));

export default NoResults; 