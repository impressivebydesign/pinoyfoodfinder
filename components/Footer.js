export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🇵🇭 PinoyFoodFinder
            </h3>
            <p className="text-gray-400">
              Connecting Filipino food lovers with authentic cuisine across America.
            </p>
          </div>
          <div>
  <h4 className="font-bold mb-4">Quick Links</h4>
  <ul className="space-y-2 text-gray-400">
    <li><a href="/submit" className="hover:text-white transition-colors">Submit a Restaurant</a></li>
    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
  </ul>
</div>
          <div>
            <h4 className="font-bold mb-4">Popular Dishes</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Adobo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sisig</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lumpia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Halo-Halo</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2025 PinoyFoodFinder.com. Connecting communities through cuisine.</p>
        </div>
      </div>
    </footer>
  );
}