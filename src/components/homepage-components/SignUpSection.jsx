import FilledButton from "../general-components/FilledButton";
import '/src/styles/dividers.css'
import { pages } from "../../constants";


function SignUpSection() {
    return <>
    <section>
        <div className="spacer button-divider-up"/>
        <div className='bg-hope-beige h-24 flex justify-center items-center'>
        <FilledButton text="Înscrie-te" route={pages.register}></FilledButton>
        </div>
        <div className="spacer button-divider-down"/>
    </section>
    </>
}

export default SignUpSection