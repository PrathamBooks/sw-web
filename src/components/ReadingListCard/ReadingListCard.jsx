import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import BookCardGroup from '../BookCardGroup';
import Link from '../Link';
import Dropdown from '../Dropdown';
import SvgIcon from '../SvgIcon';
import Menu from '../Menu';
import MenuLink from '../MenuLink';
import MenuDivider from '../MenuDivider';

import { links } from '../../lib/constants';

import './ReadingListCard.scss';

// This is used for url generation.
const pluralize = type => `${type}s`;

@translate()
class ReadingListCard extends Component {
  static defaultProps = {
    count: 0
  }

  render() {
    const baseClassName = 'pb-reading-list-card';
    const classNames = [baseClassName];

    const {
      t,
      title,
      count,
      description,
      slug,
      books,
      owner,
      wide,
      menuOpt,
      handleOptionsClick,
      canDelete,
      downloadLinks
    } = this.props;

    if (wide) {
      classNames.push(`${baseClassName}--wide`);
    }

    const listPath = `/lists/${slug}`;

    return (
      <div className={classNames.join(' ')}>
        <div className={`${baseClassName}__col-1`}>
          <div className={`${baseClassName}__book-card-group`}>
            <BookCardGroup books={books} href={listPath}/>
          </div>
        </div>
        <div className={`${baseClassName}__col-2`}>
          { menuOpt?
            <div className={`${baseClassName}__options`}>
              <Dropdown
                toggleEl={<Link><SvgIcon name="dots" size="m" pushRight/></Link>}
                minWidth="m"
                align="right"
                >
                <Menu>
                  <MenuLink
                    label={t("global.download", 1)}
                    leftIcon="download"
                    href={downloadLinks[0].href}
                    disabled={books.length <= 0}
                  />
                  <MenuDivider />
                  <MenuLink
                    label= {t("global.delete")}
                    leftIcon="bin"
                    theme="danger"
                    onClick={handleOptionsClick.bind(this, slug, "DELETE")}
                    disabled={!canDelete}
                  />
                </Menu>
              </Dropdown>
            </div>
            :
            null
          }
          <h3 className={`${baseClassName}__title`}>
            <Link parentClassName={`${baseClassName}__link`} href={listPath} isInternal={true}>{title}</Link>
          </h3>
          {
            owner && owner.name && owner.slug && owner.type
            ?
            (<Link parentClassName={`${baseClassName}__link ${baseClassName}__owner`} href={links.profile(pluralize(owner.type), owner.slug)} isInternal={true}>
            {owner.name}</Link>)
            :
            null
          }
          <div className={`${baseClassName}__count`}>{count} {t("global.story", count)}</div>
          {
            description
            ?
            (<div className={`${baseClassName}__desc`}>{description}</div>)
            :
            null
          }
        </div>
      </div>
    );
  }
}

ReadingListCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  description: PropTypes.string,
  slug: PropTypes.string.isRequired,
  books: PropTypes.arrayOf(PropTypes.shape(BookCardGroup.propTypes)),
  owner: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  }),
  wide: PropTypes.bool
};

export default ReadingListCard;
