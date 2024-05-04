// ADD A ROOM
export const addRoom = async roomData => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms`, {
        method: "POST",
        headers: {
            'content-type' : 'application/json',
        },
        body: JSON.stringify(roomData),     
    })
    const data = await response.json();
    return data;
}

// get all rooms
export const getAllRooms = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms`,)
    const data = await response.json();
    return data;
}
// get a single room data
export const getRoom = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/room/${id}`,)
    const data = await response.json();
    return data;
}

// get filtered rooms for hosts
export const getRooms = async email => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/rooms/${email}`, {
            method: "GET",
            headers: {
                'content-type' : 'application/json',
            },    
        }
    )

    const data = await response.json();
    return data
}

// delete a room
export const deleteRoom = async id => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/rooms/${id}`, {
            method: "DELETE",
            headers: {
                'content-type' : 'application/json',
            },    
        }
    )

    const data = await response.json();
    return data;
}