// services/api.ts
export const fetchUserInfo = async () => {
    const response = await fetch('http://10.1.10.248:3001/uuid');
    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }
    return response.json();
};

