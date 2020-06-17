export class RegistrationModel {
    constructor(
        public fistName: string,
        public lastName: string,
        public userName: string,
        public password: string,
        public confirmPassword: string
    ) { }
}