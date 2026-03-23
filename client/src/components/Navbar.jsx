import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="max-w-3xl mx-auto  flex items-center justify-between md:max-w-4xl lg:max-w-[70%]">
        <span className="flex items-center font-bold tracking-tight leading-none">
          <span className="text-3xl md:text-5xl">S</span>
          <span className="flex flex-col text-xs md:text-lg leading-tight ml-0.5">
            <span>wade</span>
            <span className='-mt-1.5'>pace</span>
          </span>
        </span>
        <div className="flex gap-4 sm:gap-6 text-sm md:text-lg">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-blue-400 font-semibold' : 'text-gray-300 hover:text-white'
            }
          >
            Today
          </NavLink>
          <NavLink
            to="/progress"
            className={({ isActive }) =>
              isActive ? 'text-blue-400 font-semibold' : 'text-gray-300 hover:text-white'
            }
          >
            Progress
          </NavLink>
          <NavLink
            to="/roadmap"
            className={({ isActive }) =>
              isActive ? 'text-blue-400 font-semibold' : 'text-gray-300 hover:text-white'
            }
          >
            Roadmap
          </NavLink>
        </div>
      </div>
    </nav>
  )
}