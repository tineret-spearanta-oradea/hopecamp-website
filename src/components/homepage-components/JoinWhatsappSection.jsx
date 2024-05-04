import FilledButton from "../general-components/FilledButton"

export default function JoinWhatsappSection() {
    return <>
    <section className="flex justify-center items-center py-14">
        <div className="bg-hope-darkcyan flex items-center justify-around rounded-lg w-60 h-32 sm:w-80 sm:h-40 md:w-96 md:h-52 lg:w-80 lg:h-48 xl:w-96 xl:h-60">
            <div>iconita</div>
            <div className="flex flex-col justify-around items-start gap-2 md:gap-5">
                <p className="text-2xl font-semibold">Join<br/>WhatsApp</p>
                <FilledButton text="Join"></FilledButton>
            </div>
        </div>
    </section>
    </>
}

