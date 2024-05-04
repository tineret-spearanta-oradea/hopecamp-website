import FilledButton from "../general-components/FilledButton"

export function JoinWhatsappSection() {
    return <>
    <section className="flex justify-center items-center px-8 my-24">
        <div className="bg-hope-darkcyan flex items-center justify-around rounded-lg w-96 h-32">
            <div>iconita</div>
            <div className="flex flex-col gap-2">
                <p className="text-2xl font-semibold">Join<br/>WhatsApp</p>
                <FilledButton text="Join"></FilledButton>
            </div>
        </div>
    </section>
    </>
}

