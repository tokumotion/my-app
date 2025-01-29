import Image from 'next/image';
import { ApiKey } from '../../types/apiKey';
import { maskApiKey } from '../../utils/apiKeyUtils';

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  visibleKeys: Set<string>;
  onToggleVisibility: (id: string) => void;
  onCopy: (key: string) => void;
  onDelete: (id: string) => void;
}

export default function ApiKeysTable({
  apiKeys,
  visibleKeys,
  onToggleVisibility,
  onCopy,
  onDelete,
}: ApiKeysTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-sm text-gray-400">
          <th className="text-left py-3 font-medium w-1/6">NAME</th>
          <th className="text-left py-3 font-medium w-1/12">USAGE</th>
          <th className="text-left py-3 font-medium w-7/12">KEY</th>
          <th className="text-right py-3 font-medium w-1/6">OPTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {apiKeys.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-4 text-center text-gray-400">
              No API keys found. Create one to get started.
            </td>
          </tr>
        ) : (
          apiKeys.map((key) => (
            <tr key={key.id}>
              <td className="py-4 text-white">{key.name}</td>
              <td className="py-4 text-gray-400">0</td>
              <td className="py-4 font-mono text-white">
                <div className="flex items-center gap-2">
                  <span className="truncate">
                    {visibleKeys.has(key.id) ? key.key : maskApiKey(key.key)}
                  </span>
                </div>
              </td>
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Eye Icon */}
                  <div className="relative group">
                    <button
                      onClick={() => onToggleVisibility(key.id)}
                      className="p-1.5 hover:bg-gray-800 rounded-md transition-colors"
                    >
                      <Image
                        src="/eye.svg"
                        alt={visibleKeys.has(key.id) ? "Hide" : "Show"}
                        width={16}
                        height={16}
                        className={`invert opacity-60 group-hover:opacity-100 transition-opacity ${
                          visibleKeys.has(key.id) ? 'opacity-100' : ''
                        }`}
                      />
                    </button>
                    <div className="absolute hidden group-hover:block px-2 py-1 text-sm text-white bg-gray-800 rounded-md -bottom-8 right-0 whitespace-nowrap">
                      {visibleKeys.has(key.id) ? "Hide API Key" : "Show API Key"}
                    </div>
                  </div>

                  {/* Copy Icon */}
                  <div className="relative group">
                    <button
                      onClick={() => onCopy(key.key)}
                      className="p-1.5 hover:bg-gray-800 rounded-md transition-colors"
                    >
                      <Image
                        src="/copy.svg"
                        alt="Copy"
                        width={16}
                        height={16}
                        className="invert opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    </button>
                    <div className="absolute hidden group-hover:block px-2 py-1 text-sm text-white bg-gray-800 rounded-md -bottom-8 right-0 whitespace-nowrap">
                      Copy to clipboard
                    </div>
                  </div>

                  {/* Delete Icon */}
                  <div className="relative group">
                    <button
                      onClick={() => onDelete(key.id)}
                      className="p-1.5 hover:bg-gray-800 rounded-md transition-colors"
                    >
                      <Image
                        src="/trash.svg"
                        alt="Delete"
                        width={16}
                        height={16}
                        className="invert opacity-60 group-hover:opacity-100 transition-opacity text-red-500"
                      />
                    </button>
                    <div className="absolute hidden group-hover:block px-2 py-1 text-sm text-white bg-gray-800 rounded-md -bottom-8 right-0 whitespace-nowrap">
                      Delete
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
} 