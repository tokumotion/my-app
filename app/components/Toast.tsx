export default function Toast({ message }: { message: string }) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
        {message}
      </div>
    );
  }