import { formatDistanceToNow } from 'date-fns';

interface HeaderProps {
  lastUpdated: Date | null;
}

export function Header({ lastUpdated }: HeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-3xl font-bold mb-2 text-white">GitHub Actions Dashboard</h1>
      <p className="text-gray-600">
        Last updated: {lastUpdated && formatDistanceToNow(lastUpdated, { addSuffix: true })}
      </p>
    </div>
  );
}
