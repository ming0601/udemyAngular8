export class User {
    constructor(public email: string, public id: string, private pToken: string, private pExpirationDate: Date) {}

    get token() {
        if (!this.pToken || !this.pExpirationDate || this.pExpirationDate > new Date()) {
            return null;
        }
        return this.pToken;
    }
}
