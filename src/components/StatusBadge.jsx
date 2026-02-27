const STATUS_CONFIG = {
    // Pet status
    AVAILABLE: { label: 'Available', className: 'badge-available' },
    PENDING: { label: 'Pending', className: 'badge-pending-status' },
    ADOPTED: { label: 'Adopted', className: 'badge-adopted' },
    // Application status
    APPROVED: { label: 'Approved', className: 'badge-approved' },
    REJECTED: { label: 'Rejected', className: 'badge-rejected' },
};

export default function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, className: 'badge bg-gray-100 text-gray-700' };
    return <span className={config.className}>{config.label}</span>;
}
