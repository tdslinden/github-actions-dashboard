import { Card } from './ui/card';

export function LoadingSkeleton() {
  return (
    <Card className="h-40 w-[600px] max-w-sm bg-gray-300/30 border border-gray-500 animate-pulse shadow-lg m-0" />
  );
}
