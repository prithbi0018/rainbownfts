"use client";
import MailchimpSubscribe from "react-mailchimp-subscribe"
import {Button} from "@/components";
import {useState} from "react";

const url = process.env.NEXT_PUBLIC_MAILCHIMP_URL;
const SimpleForm = () => <MailchimpSubscribe url={url}/>

const CustomForm = () => {
    const [email, setEmail] = useState({ EMAIL: "" });
    return(
        <MailchimpSubscribe
            url={url}
            render={({ subscribe, status, message }) => (
                <div>
                    <div className="flexBetween md:w-full minlg:w-557 w-357 mt-6 bg-white dark:bg-nft-black-2 border border-nft-gray-2 dark:border-nft-black-2 rounded-md">
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="h-full flex-1 w-full dark:bg-nft-black-2 bg-white px-4 rounded-md dark:text-white text-nft-black-1 font-normal text-xs minlg:text-lg outline-none"
                            onChange={(e) => setEmail({...setEmail, EMAIL: e.target.value})}
                        />
                        <div className="flex-initial">
                            <Button
                                btnName="Email me"
                                classStyles="rounded-md"
                                handeClick={() => subscribe(email)}
                            />
                        </div>
                    </div>
                    {status === "sending" && <div className="font-poppins font-semibold text-base mt-2 ml-2 text-blue-600">sending...</div>}
                    {status === "error" && <div className="font-poppins font-semibold text-base mt-2 ml-2 text-red-600" dangerouslySetInnerHTML={{__html: message}}/>}
                    {status === "success" && <div className="font-poppins font-semibold text-base mt-2 ml-2 text-green-600">Thank you for subscribing!</div>}
                </div>
            )}
        />
    )
}

export default CustomForm;
