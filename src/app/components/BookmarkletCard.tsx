interface Bookmarklet {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  version: string;
  license: string;
}

interface BookmarkletCardProps {
  bookmarklet: Bookmarklet;
}

export default function BookmarkletCard({ bookmarklet }: BookmarkletCardProps) {
  const [showFullCode, setShowFullCode] = useState(false);

  const truncatedCode = bookmarklet.code.length > 100
    ? bookmarklet.code.substring(0, 100) + '...'
    : bookmarklet.code;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-2">{bookmarklet.name}</h2>
      <p className="text-gray-600 text-sm mb-1">ID: {bookmarklet.id}</p>
      <p className="text-gray-600 text-sm mb-1">Catégorie: {bookmarklet.category}</p>
      {bookmarklet.subcategory && <p className="text-gray-600 text-sm mb-1">Sous-catégorie: {bookmarklet.subcategory}</p>}
      <p className="text-gray-600 text-sm mb-1">Version: {bookmarklet.version}</p>
      <p className="text-gray-600 text-sm mb-4">Licence: {bookmarklet.license}</p>

      <div className="bg-gray-100 p-3 rounded-md text-sm font-mono break-all mb-4">
        <h3 className="font-medium mb-2">Code:</h3>
        <pre className="whitespace-pre-wrap">
          {showFullCode ? bookmarklet.code : truncatedCode}
        </pre>
        {bookmarklet.code.length > 100 && (
          <button
            onClick={() => setShowFullCode(!showFullCode)}
            className="text-blue-500 hover:underline mt-2"
          >
            {showFullCode ? 'Voir moins' : 'Voir plus'}
          </button>
        )}
      </div>

      {/* Add buttons for copy, use, etc. later */}
    </div>
  );
}
