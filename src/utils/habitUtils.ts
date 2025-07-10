
export const getTimeUntilDeadline = (deadline: string) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  
  if (diff < 0) return 'OVERDUE';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours < 1) return `${minutes}m`;
  if (hours < 24) return `${hours}h ${minutes}m`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'danger': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
};
