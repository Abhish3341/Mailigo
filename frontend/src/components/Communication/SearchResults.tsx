import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Email } from '../../types';
import EmailItem from './EmailItem';
import axiosInstance from '../../utils/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/communications/search?q=${encodeURIComponent(query)}`);
        
        // Remove duplicates based on _id
        const uniqueResults = Array.from(
          new Map(response.data.map((item: Email) => [item._id, item])).values()
        );
        
        setResults(uniqueResults);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to perform search. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Search Results {query && `for "${query}"`}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Found {results.length} {results.length === 1 ? 'result' : 'results'}
        </p>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {results.length > 0 ? (
          results.map((email) => (
            <EmailItem 
              key={email._id} 
              email={email} 
              isSent={email.sender === user?.email}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;