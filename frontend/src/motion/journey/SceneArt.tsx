import airplane from './airplane.svg';
import back from './basket-back.svg';
import front from './basket-front.svg';

export function FlightScene() {
  return (
    <div className="journey-flight" data-flight aria-label="Puppy travel from Korea to Dubai">
      <svg viewBox="0 0 660 300" aria-hidden="true">
        <path
          data-flight-path
          d="M40 250 C 170 40, 470 20, 620 168"
          fill="none"
          stroke="#b4866b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 9"
        />
        <g fill="#c86e51">
          <circle cx="40" cy="250" r="7" />
          <circle cx="620" cy="168" r="7" />
        </g>
        <g fill="#705c50" fontSize="19" fontWeight="600">
          <text x="40" y="284" textAnchor="middle">Korea</text>
          <text x="620" y="202" textAnchor="middle">Dubai</text>
        </g>
        <g data-plane transform="translate(40 250)">
          <image href={airplane} x="-110" y="-86" width="220" height="172" />
        </g>
      </svg>
    </div>
  );
}
export function BasketScene(){return <div className="journey-basket-space"><div className="journey-basket" data-basket aria-hidden="true"><img className="journey-basket-back" src={back} alt=""/><img className="journey-basket-front" src={front} alt=""/><span className="journey-basket-caption hand">home, at last.</span></div></div>}
