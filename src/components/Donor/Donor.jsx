import React from 'react';
import { translate } from 'react-polyglot';

import './Donor.scss';


const Donor = ({ donor, t, offline }) => {
  const {
    name,
    logo
  } = donor;
const baseClassName = 'pb-donor';

  let imageTag = <img
                  className={`${baseClassName}__donor-logo`}
                  src={logo} 
                  alt={`${t("global.logo-of")} ${name}`}
                  disabled={offline}
                  />
  return (
    <div className={`${baseClassName}`}>
      {imageTag}
    </div>
    );
};

export default translate()(Donor);