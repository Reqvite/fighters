import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    const bodyElement = createFighterImage(fighter);

    const title = `${fighter.name.toUpperCase()} WIN!`;

    showModal({ title, bodyElement });
}
