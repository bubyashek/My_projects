export declare const formatDate: (dateString: string) => string;
export declare const formatDateTime: (dateString: string) => string;
export declare const getStatusLabel: (status: string) => string;
export declare const getRoleLabel: (role: string) => string;
export declare const showNotification: (message: string, type?: "success" | "error" | "info") => void;
export declare const debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => ((...args: Parameters<T>) => void);
export declare const getFullName: (user: {
    firstName: string;
    lastName: string;
    middleName?: string;
}) => string;
export declare const navigateTo: (path: string) => void;
export declare const getUrlParameter: (name: string) => string | null;
export declare const confirmAction: (message: string) => Promise<boolean>;
//# sourceMappingURL=utils.d.ts.map