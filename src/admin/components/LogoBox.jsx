import { Link } from 'react-router-dom';
import logoDark from '../assets/images/logo-dark.png';
import logoLight from '../../../public/assets/images/logo/favicon.png';
import logoSm from '../assets/images/logo-sm.png';
const LogoBox = ({
  containerClassName,
  squareLogo,
  textLogo
}) => {
  return <div className={containerClassName ?? ''}>
      <Link to="/" className="logo-dark">
<img
  src={logoLight}
  className={textLogo?.className}
  height={textLogo?.height ?? 80}
  width={textLogo?.width ?? 110}
  alt="logo light"
  style={{ marginTop: "50px" }}
/>        {/* <img src={logoDark} className={textLogo?.className} height={textLogo?.height ?? 20} width={textLogo?.width ?? 60} alt="logo dark" /> */}
      </Link>
      <Link to="/" className="logo-light">
        {/* <img className={squareLogo?.className} height={squareLogo?.height ?? 30} width={squareLogo?.width ?? 19} alt="logo sm" /> */}
<img
  src={logoLight}
  className={textLogo?.className}
  height={textLogo?.height ?? 80}
  width={textLogo?.width ?? 110}
  alt="logo light"
  style={{ marginTop: "50px" }}
/>
      </Link>
    </div>;
};
export default LogoBox;