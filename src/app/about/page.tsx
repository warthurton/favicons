const Page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">🎨 Favicons</h1>
      <p className="text-lg text-center mb-8">
        Open-source and free favicon provider with caching and resizing support.
      </p>

      <div className="w-full space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Usage</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Get Original Favicon</h3>
              <code className="block bg-gray-800 text-gray-100 p-3 rounded text-sm">
                {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/github.com
              </code>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Get Resized Favicon</h3>
              <code className="block bg-gray-800 text-gray-100 p-3 rounded text-sm">
                {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/github.com?size=medium
              </code>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Size Presets</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><code>tiny</code> - 16x16 pixels</li>
                <li><code>small</code> - 32x32 pixels</li>
                <li><code>medium</code> - 64x64 pixels</li>
                <li><code>large</code> - 128x128 pixels</li>
                <li><code>xlarge</code> - 256x256 pixels</li>
                <li><code>xxlarge</code> - 512x512 pixels</li>
              </ul>
              <p className="text-sm mt-2 text-gray-600">
                Or use exact pixel values (1-512): <code>?size=48</code>
              </p>
            </div>
          </div>
        </section>

        <section className="border-t pt-6">
          <p className="text-center text-sm text-gray-600">
            Made by{' '}
            <a
              href="https://github.com/warthurton"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              warthurton
            </a>
            {' • '}
            <a
              href="https://github.com/warthurton/favicons"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Page;
