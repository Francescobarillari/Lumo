export interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    profileImage?: string;
    description?: string;
    isAdmin?: boolean;
}
