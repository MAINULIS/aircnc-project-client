import { useContext, useState } from "react";
import Button from "../Button/Button";
import Calendar from "../Rooms/Calender"
import { AuthContext } from "../../providers/AuthProvider";
import BookingModal from "../Modals/BookingModal";
import { formatDistance } from "date-fns";
import { saveBooking, updateStatus } from "../../apis/bookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const RoomReservation = ({roomData}) => {
    console.log(roomData);
    const {user, role} = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const closeModal = () => {
        setIsOpen(false)
    }

    //  night calculation 
    const totalNight = parseFloat(
        formatDistance(
            new Date(roomData.to), 
            new Date(roomData.from)
        ).split(' ')[0]
    )
    // date
    const [value, setValue] = useState({
        startDate: new Date(roomData?.from),
        endDate: new Date(roomData.to),
        key: 'selection'
    })
    
    // booking dates state
    const [bookingInfo, setBookingInfo] = useState({
        guest:{name: user.displayName, email: user.email, image: user.photoURL},
        host: roomData.host.email,
        location: roomData.location,
        price: totalNight*roomData.price,
        to: value.endDate,
        from: value.startDate,
        title: roomData.title,
        roomId: roomData._id,
        image: roomData.image
    })
    const handleSelect = ranges => {
        setValue({...value})
    }
    // booking modal
    const modalHandler = () => {
        saveBooking(bookingInfo)
        .then(data => {
            console.log(data);
            updateStatus(roomData._id, true)
            .then(data => {
                console.log(data);
                toast.success('Booking successful!')
                navigate('/dashboard/my-bookings')
                closeModal()
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
        console.log(bookingInfo);
        closeModal()
    }
    return (
        <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
            <div className="flex flex-row items-center gap-1 p-4">
                <div className="text-2xl font-semibold">
                    $ {roomData.price}
                </div>
                <div className=" font-light text-neutral-600">
                    night
                </div>
            </div>
            <hr />
            <div className="flex justify-center">
                <Calendar 
                handleSelect={handleSelect}
                value={value}></Calendar></div>
            <hr />
            <div className="p-4"> 
            <Button
            onClick={()=> setIsOpen(true)}
             disabled={roomData.host.email === user?.email || roomData.booked} label={"Reservation"}></Button>
            </div>
            <hr />
            <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
                <div>total</div>
                <div>$ {bookingInfo.price}</div>
            </div>
        <BookingModal
        modalHandler={modalHandler}
         bookingInfo={bookingInfo}
         isOpen={isOpen}
         closeModal={closeModal}
         ></BookingModal>
        </div>
    );
};

export default RoomReservation;