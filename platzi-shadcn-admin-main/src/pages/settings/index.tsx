import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { storedUserData } from "@/store/slice/auth"; // Update the import path as needed

const Settings: React.FC = () => {
    const user = useSelector(storedUserData);

    useEffect(() => {
        if (user) {
            console.log("User info from Redux:", user);
        }
    }, [user]);

    return (
        <div className="container mx-auto p-6">
            <h1>Settings</h1>
            {user ? (
                <div>
                    <p>Email: {user.email}</p>
                    <p>Username: {user.username}</p>
                    <p>Role: {user.role}</p>
                    <p>Bio: {user.bio}</p>
                    <p>UUID: {user.uuid}</p>
                </div>
            ) : (
                <p>No user info available.</p>
            )}
        </div>
    );
};

export default Settings;
