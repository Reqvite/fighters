import { createElement } from '../../helpers/domHelper';
import { showModal } from './modal';

export function showWinnerModal(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };

  const bodyElement = createElement({
    tagName: 'img',
    className: 'modal-body',
    attributes
  });

  const title = `${fighter.name.toUpperCase()} WIN!`;

  showModal({ title, bodyElement });
}
