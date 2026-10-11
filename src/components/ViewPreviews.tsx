import { CountUp } from "@/components/StoryMotion";

// Small, static previews of the three output views (VEL-WEB-landing #views). Figures match the demo data.

export function GraphPreview() {
  const nodes = [
    { x: 10, y: 14, label: "Customers", count: "1,204" },
    { x: 150, y: 14, label: "Orders", count: "4,812" },
    { x: 10, y: 96, label: "Invoices", count: "4,790" },
    { x: 150, y: 96, label: "Products", count: "386" },
  ];
  return (
    <svg viewBox="0 0 260 150" role="img" aria-label="Graph: customers link to orders and invoices; orders link to products" className="w-full">
      <g stroke="var(--color-approved)" strokeWidth="2">
        <line x1="110" y1="34" x2="150" y2="34" />
        <line x1="60" y1="54" x2="60" y2="96" />
        <line x1="200" y1="54" x2="200" y2="96" />
      </g>
      {nodes.map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={n.y} width="100" height="40" rx="6" fill="var(--color-surface)" stroke="var(--color-line)" />
          <text x={n.x + 10} y={n.y + 17} fontSize="11" fontWeight="600" fill="var(--color-ink)">
            {n.label}
          </text>
          <text x={n.x + 10} y={n.y + 31} fontSize="10" fill="var(--color-muted)">
            {n.count} rows
          </text>
        </g>
      ))}
    </svg>
  );
}

export function TreePreview() {
  return (
    <ul className="font-mono text-xs leading-6 text-ink" aria-label="Tree: a customer, their orders and order lines">
      <li>
        Acme Hardware Co.
        <ul className="ml-4 border-l border-line pl-3">
          <li>
            SO-10432 <span className="text-muted">3 lines, $1,240</span>
            <ul className="ml-4 border-l border-line pl-3 text-muted">
              <li>Cordless drill × 2</li>
              <li>Drill bit set × 1</li>
              <li>Safety glasses × 4</li>
            </ul>
          </li>
          <li>
            SO-10518 <span className="text-muted">1 line, $86</span>
          </li>
        </ul>
      </li>
    </ul>
  );
}

export function DashboardPreview() {
  const rows: [string, React.ReactNode][] = [
    ["Orders", <CountUp key="o" value={4812} />],
    ["Customers", <CountUp key="c" value={1204} />],
    ["Duplicates merged", <CountUp key="d" value={41} />],
    ["Orders matched", <CountUp key="m" value={100} suffix="%" />],
    ["Revenue, last 12 months", <CountUp key="r" value={1.28} decimals={2} prefix="$" suffix="M" />],
  ];
  return (
    <table className="w-full text-sm" data-dashboard>
      <caption className="sr-only">Summary of the cleaned data</caption>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="border-b border-line last:border-0">
            <th scope="row" className="py-1.5 text-left font-normal text-muted">
              {label}
            </th>
            <td className="py-1.5 text-right font-semibold">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
