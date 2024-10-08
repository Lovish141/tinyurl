"use client";
import { useState, useEffect } from 'react';
import { ClipboardCopy, Link as LinkIcon,SquareArrowOutUpRight, X, ChevronDown, ChevronUp } from 'lucide-react';

interface LinkResponse {
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
}


export  function LinkShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<LinkResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<LinkResponse[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const [copySuccess, setCopySuccess] = useState<number | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('urlHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (newUrl: LinkResponse) => {
    const historyItem: LinkResponse = {
      ...newUrl,
      createdAt: new Date().toISOString(),
    };
    
    const updatedHistory = [historyItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('urlHistory', JSON.stringify(updatedHistory));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/shortner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({longUrl:url }),
      });
      
      if (!response.ok) throw new Error('Failed to shorten URL');
      
      const data = await response.json();
      setShortUrl(data);
      saveToHistory(data);
      setUrl('');
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(index ?? -1);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('urlHistory');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
      <div className="max-w-3xl mx-auto pt-16 pb-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <LinkIcon className="w-12 h-12 text-violet-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">URL Shortener</h1>
          <p className="text-gray-600">Transform your long URLs into short, shareable links</p>
        </div>

        {/* Main Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                required
                className="text-gray-900 flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {isLoading ? 'Shortening...' : 'Shorten'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-xl flex items-center">
              <span>{error}</span>
            </div>
          )}

          {shortUrl && (
             <div  className="p-4 hover:bg-gray-50 transition">
             <div className="flex items-center justify-between">
               <div className="flex-1 min-w-0 mr-4">
                 <p className="font-medium text-gray-900 truncate">{shortUrl.shortUrl}</p>
                 <div className="flex items-center gap-2 text-sm">
                   <span className="text-gray-500 truncate">{shortUrl.originalUrl}</span>
                   <span className="text-gray-400">•</span>
                   <span className="text-gray-400 whitespace-nowrap">
                     {formatDate(shortUrl.createdAt)}
                   </span>
                 </div>
               </div>
               <a href={shortUrl.shortUrl}
           className="p-2 text-violet-600 hover:bg-violet-100 rounded-lg transition"
           target='blank'>
         <SquareArrowOutUpRight className='w-5 h-5'/>
         </a>
               <button
                 onClick={() => copyToClipboard(shortUrl.shortUrl)}
                 className={`p-2 rounded-lg transition ${
                   copySuccess === -1
                     ? 'bg-green-100 text-green-600'
                     : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                 }`}
               >
                 <ClipboardCopy className="w-5 h-5" />
               </button>
             </div>
           </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">Recent Links</h2>
                <span className="text-sm text-gray-500">({history.length})</span>
              </div>
              <div className="flex items-center gap-3">
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-sm text-gray-500 hover:text-red-500 transition"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {showHistory && (
            <div className="divide-y divide-gray-100">
              {history.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No shortened URLs yet</p>
                </div>
              ) : (
                history.map((item, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="font-medium text-gray-900 truncate">{item.shortUrl}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500 truncate">{item.originalUrl}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400 whitespace-nowrap">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                      <a href={item.shortUrl}
                  className="p-2 text-violet-600 hover:bg-violet-100 rounded-lg transition"
                  target='blank'>
                <SquareArrowOutUpRight className='w-5 h-5'/>
                </a>
                      <button
                        onClick={() => copyToClipboard(item.shortUrl, index)}
                        className={`p-2 rounded-lg transition ${
                          copySuccess === index
                            ? 'bg-green-100 text-green-600'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                        }`}
                      >
                        <ClipboardCopy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}