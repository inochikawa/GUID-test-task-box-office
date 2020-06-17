import { UserModel, AuthorizationResponseModel, AuthorizationModel } from "../Models";
import { getAppService } from "../Utils/getAppService";
import { ApiService } from "./ApiService";
import { observable, computed, action } from "mobx";

export class UserService {
    @observable private _currentUser: UserModel | undefined;

    constructor(private _apiService: ApiService) {
    }

    @computed get currentUser(): UserModel | undefined {
        return this._currentUser;
    }

    @computed get isAuthorized(): boolean {
        return !!this._currentUser;
    }

    @action.bound async authorize(model: AuthorizationModel): Promise<AuthorizationResponseModel> {
        const result = new AuthorizationResponseModel();

        try {
            const loginResponse = await this._apiService.fetch("authorization", {
                method: "POST",
                body: JSON.stringify(model)
            });

            if (loginResponse.ok) {
                this._currentUser = await loginResponse.json();
                result.user = Object.assign({}, this._currentUser);
            } else {
                result.errors = [await loginResponse.text()];
            }

            console.log("User: ", this._currentUser);

        } catch (error) {
            console.log("Error: ", error);
            result.errors = [error];
        }

        return result
    }
}