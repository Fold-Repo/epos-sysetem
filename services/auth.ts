import { ENDPOINT } from "@/constants";
import { client } from "@/lib";
import { 
    RegistrationPayload, 
    RegistrationResponse, 
    RequestOTPPayload, 
    RequestOTPResponse,
    VerifyAccountPayload,
    VerifyAccountResponse,
    ResetPasswordPayload,
    ResetPasswordResponse,
    LoginPayload,
    LoginResponse,
    GoogleSignInPayload,
    GoogleSignUpPayload,
    GoogleSignInResponse,
    GoogleSignUpResponse
} from "@/types";

export async function register(payload: RegistrationPayload): Promise<RegistrationResponse> {
    const response = await client.post(ENDPOINT.AUTH.SIGNUP, payload);
    return response.data;
}

export async function requestOTP(payload: RequestOTPPayload): Promise<RequestOTPResponse> {
    const response = await client.post(ENDPOINT.AUTH.REQUEST_OTP, payload);
    return response.data;
}

export async function verifyAccount(payload: VerifyAccountPayload): Promise<VerifyAccountResponse> {
    const response = await client.post(ENDPOINT.AUTH.VERIFY_ACCOUNT, payload);
    return response.data;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
    const response = await client.patch(ENDPOINT.AUTH.RESET_PASSWORD, payload);
    return response.data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await client.post(ENDPOINT.AUTH.LOGIN, payload);
    return response.data;
}

export async function googleSignIn(payload: GoogleSignInPayload): Promise<GoogleSignInResponse> {
    const response = await client.post(ENDPOINT.AUTH.GOOGLE_SIGNIN, payload);
    return response.data;
}

export async function googleSignUp(payload: GoogleSignUpPayload): Promise<GoogleSignUpResponse> {
    const response = await client.post(ENDPOINT.AUTH.GOOGLE_SIGNUP, payload);
    return response.data;
}
