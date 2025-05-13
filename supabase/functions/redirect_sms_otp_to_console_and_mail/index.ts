import {Webhook} from "https://esm.sh/standardwebhooks@1.0.0";
import {serve} from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {

    try {
        console.log("--- SMS Webhook Received ---");

        const payload = await req.text();
        const headers = Object.fromEntries(req.headers);
        const wh = new Webhook("dGVzdHNkYWRhc2RhZHNhc2RhZGFzZGFkYXNk");
        const payloadDecoded = wh.verify(payload, headers);

        const phone = payloadDecoded.user.phone;
        const otp = payloadDecoded.sms.otp;

        console.log(`Extracted Phone: ${phone}`);
        console.log(`Extracted OTP Code: ${otp}`);
        console.log("Full Payload:", JSON.stringify(payloadDecoded, null, 2));
        console.log("--------------------------");

        // --- Send to Mailpit ---
        const mailpitUrl = "http://inbucket:8025/api/v1/send"; // Use service name and internal port
        const emailPayload = {
            From: { Email: "supabase-webhook@example.com", Name: "Supabase SMS Hook" },
            To: [{ Email: "otp-receiver@example.com", Name: "OTP Receiver" }],
            Subject: `OTP for ${phone} is ${otp}`,
            Text: `phone: ${phone}\notp: ${otp}\npayload:\n${JSON.stringify(payloadDecoded, null, 2)}`,
            Tags: [phone] // Add phone number as a tag
        };

        try {
            const mailpitResponse = await fetch(mailpitUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(emailPayload),
            });

            if (!mailpitResponse.ok) {
                const errorBody = await mailpitResponse.text();
                console.error(`Error sending OTP to Mailpit: ${mailpitResponse.status} ${mailpitResponse.statusText}`, errorBody);
                throw new Error("Error sending phone!");
            } else {
                console.log("Successfully forwarded OTP details to Mailpit.");
            }
        } catch (mailpitError) {
            console.error("Failed to fetch Mailpit API:", mailpitError);
            throw mailpitError;
        }
        return new Response(JSON.stringify({ status: "ok", received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error processing SMS webhook:", error);

        return new Response(JSON.stringify({ error: "Failed to process request", details: error.message }), {
            status: 500, // Use 500 for internal errors, 400 might be suitable for verification errors
            headers: { "Content-Type": "application/json" },
        });
    }
});
