export function LogoSplash() {
  return (
    <div className="splash-wrapper">
      <div className="splash-box">
        <div className="splash-inner">
          <div className="splash-logo-appear">
            {/* img directo para que .splash-logo aplique transform-origin: bottom right sobre el elemento real */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/novitic-logo.png" alt="Novitic" className="splash-logo" />
          </div>
          <div className="splash-reflection-line" />
        </div>
      </div>
    </div>
  );
}
