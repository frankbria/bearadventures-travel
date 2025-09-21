import React from 'react'

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bear Adventures Travel
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your gateway to unforgettable travel experiences. Currently migrating from WordPress to modern React architecture.
        </p>
      </header>

      <main>
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Migration in Progress
          </h2>
          <p className="text-gray-700 mb-4">
            We're currently porting our travel content and experiences from our WordPress site to this new React application.
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></span>
              Phase 1: Content Extraction - Pending
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-gray-300 rounded-full mr-3"></span>
              Phase 2: Asset Management - Pending
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-gray-300 rounded-full mr-3"></span>
              Phase 3: React Architecture - In Progress
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-gray-300 rounded-full mr-3"></span>
              Phase 4: Content Integration - Pending
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-gray-300 rounded-full mr-3"></span>
              Phase 5: Deployment - Pending
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://bearadventures.travel"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            Visit Current WordPress Site
          </a>
        </div>
      </main>
    </div>
  )
}

export default HomePage