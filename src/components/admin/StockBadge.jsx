import { useSettings } from "../../context/SettingsContext";

export default function StockBadge({ stock }) {
  const { settings } = useSettings();
  const lowStockThreshold = settings?.lowStockThreshold || 10;

  const getBadge = (stockLevel) => {
    if (stockLevel <= 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-500/20 text-red-400 border-red-500/30",
      };
    } else if (stockLevel > 0 && stockLevel <= lowStockThreshold) {
      return {
        label: "Low Stock",
        className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      };
    } else {
      return {
        label: "In Stock",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
      };
    }
  };

  const badge = getBadge(stock);

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-poppins font-medium border ${badge.className}`}
    >
      {badge.label} ({stock})
    </span>
  );
}
