export default function Header({ stats }) {
  return (
    <header className="bg-gradient-to-r from-red-600 via-red-700 to-amber-600 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-5xl">🇵🇭</span>
          <h1 className="text-5xl font-bold">PinoyFoodFinder</h1>
        </div>
        <p className="text-amber-100 text-xl mb-2">
          Discover authentic Filipino cuisine across America
        </p>
        <p className="text-amber-200 text-sm">
          ✨ Now featuring signature dishes at every location
        </p>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="font-bold">{stats.totalRestaurants}</span> Locations
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <span className="font-bold">{stats.totalStates}</span> States
          </div>
        </div>
      </div>
    </header>
  );
}