import AddRoomForm from "../../components/Forms/AddRoomForm";
import { useState } from "react";
import { imageUpload } from "../../apis/imageUpload";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { addRoom } from "../../apis/rooms";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dates, setDates] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })
    const [loading, setLoading] = useState(false);
    const [uploadButtonText, setUploadButtonText] = useState('Upload Image')
    const handleSubmit = event => {
        event.preventDefault();
        setLoading(true)
        const location = event.target.location.value;
        const title = event.target.title.value;
        const from = dates.startDate;
        const to = dates.endDate;
        const price = event.target.price.value;
        const guests = event.target.total_guest.value;
        const bedrooms = event.target.bedrooms.value;
        const bathrooms = event.target.bathrooms.value;
        const description = event.target.description.value;
        const category = event.target.category.value;
        const image = event.target.image.files[0];
        setUploadButtonText('Uploading...')
        // upload image
        imageUpload(image)
            .then(data => {
                const roomData = {
                    location,
                    image: data.data.display_url, from, to, title, price, guests, bedrooms, bathrooms, description,
                    host: {
                        name: user?.displayName,
                        image: user?.photoURL,
                        email: user?.email,
                    },
                    category,

                }

                // post room data to server
                 addRoom(roomData)
                 .then(data => {console.log(data)
                    setUploadButtonText('Uploaded')
                    setLoading(false)
                    toast.success('Your Room Added Successfully')
                    event.target.reset();
                    navigate('/dashboard/my-listings')
                 })
                 .catch(err => console.log(err))

                setLoading(false)
            })
            .catch(err => {
                console.log(err.message);
                setLoading(false)
            })

    }

    const handleImageChange = image => {
        setUploadButtonText(image.name)
    }
    const handleDates = ranges => {
        setDates(ranges.selection)
    }
    return (
        <div>
            <AddRoomForm
                handleSubmit={handleSubmit}
                loading={loading}
                handleImageChange={handleImageChange}
                uploadButtonText={uploadButtonText}
                dates={dates}
                handleDates={handleDates}
            ></AddRoomForm>
        </div>
    );
};

export default AddRoom;