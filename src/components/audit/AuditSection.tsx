import { motion } from "framer-motion";
import { ReactNode } from "react";
import ScoreRing from "./ScoreRing";
import { LucideIcon } from "lucide-react";

interface AuditSectionProps {
  title: string;
  icon: LucideIcon;
  score?: number;
  scoreLabel?: string;
  children: ReactNode;
  delay?: number;
}

const AuditSection = ({ title, icon: Icon, score, scoreLabel, children, delay = 0 }: AuditSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl border bg-card p-6 card-elevated"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        {score !== undefined && <ScoreRing score={score} size={80} label={scoreLabel} />}
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
};

export default AuditSection;

export const BulletList = ({ items, variant = "default" }: { items: string[]; variant?: "default" | "success" | "warning" }) => {
  const colors = {
    default: "bg-primary/10 text-primary",
    success: "bg-score-excellent/10 text-score-excellent",
    warning: "bg-score-good/10 text-score-good",
  };

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${variant === "success" ? "bg-score-excellent" : variant === "warning" ? "bg-score-good" : "bg-primary"}`} />
          <span className="text-card-foreground/80">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export const SubHeading = ({ children }: { children: ReactNode }) => (
  <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">{children}</h4>
);
