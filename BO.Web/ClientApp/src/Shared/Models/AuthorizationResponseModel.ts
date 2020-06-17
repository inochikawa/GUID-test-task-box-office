import { UserModel } from "./UserModel";

export class AuthorizationResponseModel {
    user: UserModel | undefined;
    errors: string[] | undefined;
}