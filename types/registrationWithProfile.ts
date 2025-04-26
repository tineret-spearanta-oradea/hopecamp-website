import {UserRegistration} from "@/types/userRegistration";
import {UserProfile} from "@/types/userProfile";

export interface RegistrationWithProfile extends UserRegistration, UserProfile {
}