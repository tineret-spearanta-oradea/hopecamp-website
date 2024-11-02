export function LoadingSpinner() {
  return (
    <div className="flex justify-center" aria-label="Loading...">
      <div className="animate-spin h-6 w-6 border-2 border-hope-green border-t-transparent rounded-full" />
    </div>
  );
}
