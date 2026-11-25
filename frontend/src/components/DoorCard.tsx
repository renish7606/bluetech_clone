import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import type { Puppy } from '../lib/api';

interface DoorCardProps {
  puppy: Puppy;
  index: number;
  isOpenExternal?: boolean;
}

const doorLeafGradients = [
  'linear-gradient(135deg, #bd896d, #9f6b54)',
  'linear-gradient(135deg, #8d7161, #6f5446)',
  'linear-gradient(135deg, #d0ad7b, #b88d5d)',
  'linear-gradient(135deg, #b98268, #98634d)',
];

export function DoorCard({ puppy, index, isOpenExternal = false }: DoorCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isOpen = isOpenExternal || isHovered;
  const image = puppy.media.find((media) => media.type === 'image')?.url || puppy.media[0]?.url;

  return (
    <article
      className={`tp-door-wrap ${isOpen ? 'is-open' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/puppies/${puppy.slug}`} className="tp-door-link" aria-label={`View ${puppy.name}`}>
        <div className="tp-door-header">
          <h3 className="tp-door-title">{puppy.name}</h3>
          <p className="tp-door-subtitle">
            {puppy.breed !== puppy.name ? `${puppy.breed}, ` : ''}
            {puppy.sex.toLowerCase()}
            {puppy.age ? `, ${puppy.age}` : ''}
            {puppy.has_video ? ', with video' : ''}
          </p>
        </div>
        <div className="tp-door-frame">
          <span className="tp-door-avail-badge">
            {puppy.status === 'available' ? 'Available' : 'Gone home'}
          </span>
          <div className="tp-door-room">
            {image ? (
              <img src={image} alt={`${puppy.name}, ${puppy.breed}`} className="tp-door-photo" loading="lazy" />
            ) : (
              <div className="tp-door-placeholder">
                <PawPrint size={40} />
              </div>
            )}
            <div className="tp-door-glow" aria-hidden="true" />
          </div>
          <div
            className={`tp-door-leaf ${isOpen ? 'is-open' : ''}`}
            style={{ background: doorLeafGradients[index % doorLeafGradients.length] }}
            aria-hidden="true"
          >
            <div className="tp-door-panel-line" />
            <div className="tp-door-peephole"><PawPrint size={18} /></div>
            <div className="tp-door-knob"><div className="tp-door-knob-shine" /></div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default DoorCard;
