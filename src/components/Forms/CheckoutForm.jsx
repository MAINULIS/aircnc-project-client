import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "./CheckoutForm.css"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { updateStatus } from "../../apis/bookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {ImSpinner9} from 'react-icons/im'

const CheckoutForm = ({ closeModal, bookingInfo }) => {
    const { user } = useContext(AuthContext);
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState("");
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);


    useEffect(() => {
        // generate client secret and save in state
        if (bookingInfo?.price > 0) {
            axiosSecure.post('/create-payment-intent', { price: bookingInfo?.price })
                .then(res => {
                    console.log(res.data.clientSecret);
                    setClientSecret(res.data.clientSecret)
                })
        }
    }, [axiosSecure, bookingInfo])

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
            setCardError(error.message)
        } else {
            console.log('[PaymentMethod]', paymentMethod);
        }
            setProcessing(true)
        // confirm payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: user?.displayName || 'Unknown',
                    email: user?.email || 'Anonymous'
                },
            },
        })
        if (confirmError) {
            console.log('[error]', confirmError);
            setCardError(confirmError.message)
        } else {
            console.log('[paymentIntent]', paymentIntent);
        }

        if(paymentIntent.status === 'succeeded'){
            // save payment info in db
            const paymentInfo = {
                ...bookingInfo,
                transactionId: paymentIntent.id,
                date: new Date(),
            }
           axiosSecure.post('/bookings', paymentInfo)
           .then(res => {
            console.log(res.data);
            if(res.data.insertedId){
                updateStatus(paymentInfo.roomId, true)
                .then(data => {
                    console.log(data);
                    const text = `Booking Successful!, TransactionId: ${paymentInfo.id}`
                    toast.success(text)
                    navigate('/dashboard/my-bookings')
                    setProcessing(false)
                    closeModal();
                })
                .catch(err =>{ 
                    console.log(err)
                    setProcessing(false)
                })
            }
           })

            
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <div className='flex mt-2 justify-around'>
                    <button
                        type='button'
                        className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!stripe || !clientSecret || processing }
                        type='Submit'
                        className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                    >
                       {processing && !cardError ?  <ImSpinner9 className="m-auto animate-spin" size={24}></ImSpinner9> :` Pay ${bookingInfo.price}$`}
                    </button>
                </div>
            </form>
            {/* show errors */}
            {
                cardError && <p className="text-red-600 text-center mt-4">{cardError}</p>
            }
        </>
    );
};

export default CheckoutForm;