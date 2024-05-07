import FilledButton from "../general-components/FilledButton";
import "/src/styles/dividers.css";
import { pages } from "../../constants";
import JoinSocialsSection from "./JoinSocialsSection";

function SignUpSection() {
  return (
    <>
      <section>
        <div className="spacer button-divider-up" />
        <div className="p-10 bg-hope-beige flex-1 justify-center items-center text-center">
          <JoinSocialsSection />
          <FilledButton text="Înscrie-te" route={pages.register}></FilledButton>
        </div>
        <div className="spacer button-divider-down" />
      </section>
    </>
  );
}

export default SignUpSection;
