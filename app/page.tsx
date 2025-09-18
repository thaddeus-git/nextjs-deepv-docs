import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">DeepV Code</h1>
        <p className="text-xl text-gray-600">
          Welcome to <strong>DeepV Code</strong> - your comprehensive source for AI-curated technical documentation and tutorials.
        </p>
      </div>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚀 What You&apos;ll Find Here</h2>
        <p className="text-gray-600 mb-4">Discover expertly curated guides and tutorials covering:</p>
        <ul className="space-y-2 text-gray-600">
          <li><strong>Programming Languages</strong> - Master modern programming languages with practical examples</li>
          <li><strong>Databases</strong> - Learn database management and optimization techniques</li>
          <li><strong>Mobile Development</strong> - Build apps for iOS and Android platforms</li>
          <li><strong>System & DevOps</strong> - Deploy, monitor, and maintain robust systems</li>
          <li><strong>Web Frontend</strong> - Create engaging user interfaces and experiences</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">🎯 AI-Curated Knowledge</h2>
        <p className="text-gray-600">
          Our content is powered by AI curation, transforming complex Stack Overflow discussions and technical knowledge into clear, actionable guides that help you solve real problems.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">📚 Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/databases" className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
            <div className="text-3xl mb-3">🗄️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Databases</h3>
            <p className="text-gray-600 text-sm">SQL, NoSQL, optimization</p>
          </Link>
          <Link href="/mobile" className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Development</h3>
            <p className="text-gray-600 text-sm">iOS, Android, React Native</p>
          </Link>
          <Link href="/programming-languages" className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
            <div className="text-3xl mb-3">💻</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Programming Languages</h3>
            <p className="text-gray-600 text-sm">JavaScript, Python, Java</p>
          </Link>
          <Link href="/system-devops" className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System & DevOps</h3>
            <p className="text-gray-600 text-sm">Docker, AWS, monitoring</p>
          </Link>
          <Link href="/web-frontend" className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Frontend</h3>
            <p className="text-gray-600 text-sm">React, CSS, HTML</p>
          </Link>
          <Link href="/guides" className="block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Guides</h3>
            <p className="text-gray-600 text-sm">Browse everything</p>
          </Link>
        </div>
      </section>

      <div className="text-center text-gray-600">
        <p>Ready to dive in? Use the navigation menu to explore our comprehensive collection of technical guides.</p>
      </div>
    </div>
  )
}