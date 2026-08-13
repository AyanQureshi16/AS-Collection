import { Check, FileText, XCircle } from "lucide-react";

export default function StatusBadge({ status }) {
  const badges = {
    Active: {
      icon: Check,
      className: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    Draft: {
      icon: FileText,
      className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    },
    "Out of Stock": {
      icon: XCircle,
      className: "bg-red-500/20 text-red-400 border-red-500/30",
    },
  };

  const badge = badges[status] || badges.Draft;
  const Icon = badge.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-poppins font-medium border ${badge.className}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}
