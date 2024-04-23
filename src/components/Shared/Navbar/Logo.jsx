import { Link } from 'react-router-dom';
import logoImg from '../../../assets/images/logo.png'
const Logo = () => {
    return (
        <Link to="/">
            <div className='hidden md:block'>
                <img src={logoImg} alt="logo" width={100} height={100} />
            </div>
        </Link>
    );
};

export default Logo;