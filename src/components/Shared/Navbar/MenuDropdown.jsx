import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "./Avatar";
import HostModal from "../../Modals/HostRequestModal";
import { becomeHost } from "../../../apis/auth";
import toast from "react-hot-toast";

const MenuDropdown = () => {
  const { user, logOut, role, setRole } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  //   const toggleOpen = useCallback(() => {
  //     setIsOpen(value => !value)
  //   }, [])

  const modalHandler = email => {
    becomeHost(email)
    .then(data => {
      console.log(data);
      toast.success('You are host now, Post Rooms!');
      setRole('host')
      closeModal();
    })
  }
  const closeModal = () => {
    setModal(false);
  }
  return (
    <div className='relative'>
      <div className='flex flex-row items-center gap-3'>
        <div
        className='hidden md:block '>
         {
          !role && (<button onClick={() => setModal(true)} disabled={!user} className="cursor-pointer text-sm font-semibold hover:bg-neutral-100 transition py-3 px-4 rounded-full "> AirCNC your home</button>)
         }
        </div>
        <div
          // onClick={toggleOpen}
          onClick={() => setIsOpen(!isOpen)}
          className='p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
        >
          <AiOutlineMenu />
          <div className='hidden md:block'>
            <Avatar />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm'>
          <div className='flex flex-col cursor-pointer'>
            <Link
              to='/'
              className='block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold'
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to='/dashboard'
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                >
                  Dashboard
                </Link>

                <div
                  onClick={() =>{
                    setRole(null)
                    logOut()}}
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer'
                >
                  Logout
                </div>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                >
                  Login
                </Link>
                <Link
                  to='/signup'
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <HostModal
       email={user?.email}
       modalHandler={modalHandler} 
       isOpen={modal}
       closeModal={closeModal}
       >
       </HostModal>
    </div>
  );
};

export default MenuDropdown;