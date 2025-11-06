import { Link } from 'react-router-dom';
const logoPublic = '/logoh3.png';
const LogoBox = ({
  containerClassName,
  squareLogo,
  textLogo
}) => {
  return <div className={containerClassName ?? ''}>
      <Link to="/" className="logo-dark">
        <img src={logoPublic} className={squareLogo?.className} height={squareLogo?.height ?? 30} width={squareLogo?.width ?? 30} alt="logo" />
        <img src={logoPublic} className={textLogo?.className} height={textLogo?.height ?? 20} width={textLogo?.width ?? 60} alt="logo" />
      </Link>
      <Link to="/" className="logo-light">
        <img src={logoPublic} className={squareLogo?.className} height={squareLogo?.height ?? 30} width={squareLogo?.width ?? 30} alt="logo" />
        <img src={logoPublic} className={textLogo?.className} height={textLogo?.height ?? 20} width={textLogo?.width ?? 60} alt="logo" />
      </Link>
    </div>;
};
export default LogoBox;