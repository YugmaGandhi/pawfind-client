import { FaDog, FaCat, FaDove, FaFish, FaPaw } from 'react-icons/fa';
import { GiRabbit, GiHamburger } from 'react-icons/gi';
import { MdPets } from 'react-icons/md';

const SPECIES_ICON_MAP = {
    Dog: FaDog,
    Cat: FaCat,
    Bird: FaDove,
    Fish: FaFish,
    Rabbit: GiRabbit,
};

/**
 * Renders a species-appropriate icon.
 * Falls back to a generic paw icon for unknown species.
 */
export default function PetSpeciesIcon({ species, className = '' }) {
    const Icon = SPECIES_ICON_MAP[species] ?? FaPaw;
    return <Icon className={className} />;
}

/** Renders just the paw logo icon */
export function PawIcon({ className = '' }) {
    return <MdPets className={className} />;
}
