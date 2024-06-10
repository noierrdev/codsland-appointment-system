import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import { Button, Grid, InputAdornment, TextField } from '@mui/material'
import { CardTravelOutlined, EmailOutlined, Event, LocationOn, PersonOutlined, PhoneOutlined, TextsmsOutlined } from '@mui/icons-material'
import Confirm from '../components/general/Confirm'
import { useState } from 'react'
import {Elements,PaymentElement,useElements,useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useEffect } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../Configs'
import { useRef } from 'react'

const stripePromise = loadStripe('pk_test_51OVOQtFhFnxnoDMRquya5UT74vYR3BcJFVk79wFhtcXg3hgvyM44n9papYedTEXyoIqqYZWFKBGkfxTampbb7sG400RmgjkKoR');
const localizer = momentLocalizer(moment)
const CheckoutForm=()=>{
    const stripe=useStripe();
    const elements=useElements();
    const handlePayment=async (e)=>{
        e.preventDefault();
        if(!stripe||!elements) return;
        console.log(elements)
        const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        redirect:"if_required"
        });
        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            console.log(result)
        }
    }
    return (
        <>
        <form onSubmit={handlePayment} >
            <PaymentElement/>
            <Button
            sx={{margin:1}}
            type='submit'
            variant='outlined'
            >Finish booking</Button>
        </form>
        </>
    )
}
export default function(props){
    const [AskSave,setAskSave]=useState(false);
    const [PaymentIntent,setPaymentIntent]=useState(null);
    const refFullname=useRef(null);
    const refEmail=useRef(null);
    const refPhonenumber=useRef(null)
    const refLocation=useRef(null);
    const refDescription=useRef(null);
    const refEvent=useRef(null)
    
    const startSaving=()=>{
        axios.post(`${BACKEND_URL}/appointments/start-payment`,{
            price:15000
        })
        .then(response=>{
            if(response.data.status=="success"){
                setPaymentIntent(response.data.data)
            }
        })
    }
    
    return (
        <>
        <Grid spacing={2} container justifyContent={`around`} alignItems={'center'}>
            <Grid item lg={6} sm={12} md={12}  >
                <Calendar
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onRangeChange={e=>console.log(e)}
                />
            </Grid>
            <Grid item lg={6} sm={12} md={12} >
                <TextField
                fullWidth
                variant='outlined'
                label="Dr Dean's work event"
                margin='normal'
                disabled
                inputRef={refEvent}
                InputProps={{
                    startAdornment:(
                    <InputAdornment>
                        <Event/>
                    </InputAdornment>
                    )

                }}
                />
                <TextField
                fullWidth
                variant='outlined'
                label="Your name"
                margin='normal'
                inputRef={refFullname}
                InputProps={{
                    startAdornment:(
                    <InputAdornment>
                        <PersonOutlined/>
                    </InputAdornment>
                    )

                }}
                />
                <TextField
                fullWidth
                variant='outlined'
                label="Your Email"
                margin='normal'
                InputProps={{
                    startAdornment:(
                    <InputAdornment>
                        <EmailOutlined/>
                    </InputAdornment>
                    )

                }}
                inputRef={refEmail}
                />
                <TextField
                fullWidth
                variant='outlined'
                label="Your Phone"
                margin='normal'
                InputProps={{
                    startAdornment:(<InputAdornment>
                        <PhoneOutlined/>
                    </InputAdornment>)

                }}
                inputRef={refPhonenumber}
                />
                <TextField
                fullWidth
                variant='outlined'
                label="Your Location"
                margin='normal'
                InputProps={{
                    startAdornment:(<InputAdornment>
                        <LocationOn/>
                    </InputAdornment>)

                }}
                inputRef={refLocation}
                />
                <TextField
                fullWidth
                multiline
                rows={6}
                variant='outlined'
                label="Description"
                margin='normal'
                inputRef={refDescription}
                />
                {
                    !PaymentIntent?(
                        <Button
                        variant='outlined'
                        onClick={startSaving}
                        
                        >
                            Request
                        </Button>
                    ):(
                        <Elements stripe={stripePromise} options={PaymentIntent}>
                            <CheckoutForm/>
                        </Elements>
                    )
                }
                
            </Grid>
        
        </Grid>
        <Confirm onOk={e=>console.log("ok")} onCancel={e=>setAskSave(false)} open={AskSave} />
        </>
    )
}