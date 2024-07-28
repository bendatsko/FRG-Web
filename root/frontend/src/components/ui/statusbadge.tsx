import React from 'react';

const StatusBadge = ({ status }) => {
    const getBadgeClass = () => {
        // Use `table-badge` and append status for specific styling
        return `table-badge ${status.toLowerCase()}`;
    };

    const getDot = () => {
        // Dot classes remain the same since they are correctly styled
        switch (status) {
            case 'Running':
                return <span className="blue-dot"></span>;
            case 'Completed':
                return <span className="green-dot"></span>;
            case 'Failed':
                return <span className="red-dot"></span>;
            case 'Queued':
                return <span className="yellow-dot"></span>;
            default:
                return null;
        }
    };

    return (
        <div className={getBadgeClass()}>
            {getDot()}
            {status}
        </div>
    );
};

export default StatusBadge;
