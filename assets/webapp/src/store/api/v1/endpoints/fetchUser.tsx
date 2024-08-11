// services/api.ts
export const fetchUserInfo = async () => {
    const response = await fetch('http://localhost:3001/uuid');
    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }
    return response.json();
};

