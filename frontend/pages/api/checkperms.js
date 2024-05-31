// pages/api/checkAdmin.js

import { NextApiRequest, NextApiResponse } from 'next';
import permissions from '../../data/permissions.json';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { userId } = req.body;

        const user = permissions.find(user => user.id === userId);

        if (user) {
            const isAdmin = user.roles.includes('is_admin');
            res.status(200).json({ isAdmin });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
