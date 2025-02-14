import { useMemo } from 'preact/hooks';
import { useStoreProxy } from '../store/use-store';

import { isThirdPartyUser } from '../helpers/account-id';
import { withServices } from '../service-context';

/** @typedef {import('../../types/api').Annotation} Annotation */

/**
 * @typedef TagListProps
 * @prop {Annotation} annotation - Annotation that owns the tags.
 * @prop {string[]} tags - List of tags as strings.
 * @prop {(a: string, b: Object<'tag', string>) => any} serviceUrl - Services
 */

/**
 * Component to render an annotation's tags.
 * @param {TagListProps} props
 */
function TagList({ annotation, serviceUrl, tags }) {
  const store = useStoreProxy();
  const defaultAuthority = store.defaultAuthority();
  const renderLink = useMemo(
    // Show a link if the authority of the user is not 3rd party
    () => !isThirdPartyUser(annotation.user, defaultAuthority),
    [annotation, defaultAuthority]
  );

  /**
   * Returns a uri link for a specific tag name.
   * @param {string} tag
   * @return {string}
   */
  const createTagSearchURL = tag => {
    return serviceUrl('search.tag', { tag: tag });
  };

  return (
    <ul className="TagList" aria-label="Annotation tags">
      {tags.map(tag => (
        <li key={tag} className="TagList__item">
          {renderLink && (
            <a
              className="TagList__link"
              href={createTagSearchURL(tag)}
              lang=""
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Tag: ${tag}`}
              title={`View annotations with tag: ${tag}`}
            >
              {tag}
            </a>
          )}
          {!renderLink && (
            <span className="TagList__text" aria-label={`Tag: ${tag}`} lang="">
              {tag}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

TagList.injectedProps = ['serviceUrl'];

export default withServices(TagList);
