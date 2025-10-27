export interface User {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    email: string;
    photo: string;
    role: 'admin' | 'user';
    status: 'active' | 'blocked' | 'unconfirmed';
}
export interface News {
    id: number;
    userId: number;
    title: string;
    content: string;
    image?: string;
    createdAt: string;
    status: 'active' | 'blocked';
}
export declare const usersAPI: {
    getAll: () => Promise<User[]>;
    getById: (id: number) => Promise<User>;
    create: (data: Partial<User>) => Promise<User>;
    update: (id: number, data: Partial<User>) => Promise<User>;
    delete: (id: number) => Promise<{
        message: string;
    }>;
    getFriends: (id: number) => Promise<User[]>;
};
export declare const newsAPI: {
    getAll: () => Promise<News[]>;
    getFriendsNews: (userId: number) => Promise<News[]>;
    create: (data: Partial<News>) => Promise<News>;
    updateStatus: (id: number, status: "active" | "blocked") => Promise<News>;
    delete: (id: number) => Promise<{
        message: string;
    }>;
};
export declare const friendsAPI: {
    add: (userId: number, friendId: number) => Promise<{
        message: string;
    }>;
    remove: (userId: number, friendId: number) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=api.d.ts.map