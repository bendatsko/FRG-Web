import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const ShareModal = ({ testId, accessibleTo, onShare, onRemove }) => {
    const [newUser, setNewUser] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Parse accessibleTo if it's a string, or use it directly if it's already an array
        const parsedUsers = typeof accessibleTo === 'string' 
            ? JSON.parse(accessibleTo || '[]') 
            : Array.isArray(accessibleTo) ? accessibleTo : [];
        setUsers(parsedUsers);
    }, [accessibleTo]);

    const handleShare = () => {
        onShare(newUser);
        setNewUser('');
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Share
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Test</DialogTitle>
                    <DialogDescription>
                        Share this test with other users or remove their access.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Input
                            id="username"
                            placeholder="Enter username"
                            value={newUser}
                            onChange={(e) => setNewUser(e.target.value)}
                        />
                        <Button onClick={handleShare}>Share</Button>
                    </div>
                    <div>
                        <h4 className="mb-2 font-medium">Users with access:</h4>
                        {users.length > 0 ? (
                            <ul>
                                {users.map((user) => (
                                    <li key={user} className="flex items-center justify-between py-1">
                                        {user}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onRemove(user)}
                                        >
                                            Remove
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No users have access to this test.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;