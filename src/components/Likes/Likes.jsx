import React from 'react';
import Link from '../Link';
import SvgIcon from '../SvgIcon';
import Stat from '../Stat';
import AuthDropdown from '../AuthDropdown';
import { translate } from 'react-polyglot';

const Likes= ( {t , isliked, likesCount, onLike, isLoggedIn, openAuthModal, logInMsg, parentClassName} ) => {

  const likeEl =  (<div className={parentClassName}>
                    { likesCount === 0
                      ?
                      <Link onClick={isLoggedIn ? onLike: null}>
                        <SvgIcon name="heart-outline" size="m" pushRight/>
                        {t("global.like", 1)}
                      </Link>
                      :
                      <Stat
                        iconVariant="accent"
                        icon={isliked ? 'heart': 'heart-outline'}
                        value={likesCount}
                        onClick={isLoggedIn ? (!isliked ? onLike : null) : () => {}}/>
                    }
                  </div>)
  
  if(isLoggedIn){
    return likeEl;
  } else {
      return (<AuthDropdown
                t={t}
                openAuthModal={openAuthModal}
                toggleEl = { likeEl }
                loginText = {logInMsg}
              />);
  }
}

export default translate()(Likes);
