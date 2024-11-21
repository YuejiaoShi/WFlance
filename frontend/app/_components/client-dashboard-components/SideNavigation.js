import Link from "next/link";

async function SideNavigation() {
  return (
    <nav className="col-span-2 row-span-9 row-start-3 bg-primary-800 text-primary-100 text-xl h-full">
      <ul className="grid grid-cols-3 grid-rows-7 mt-8 h-2/4">
        <li className="col-span-3 flex items-center justify-center hover:bg-primary-900 w-full hover:text-primary-100 transition-colors  gap-4 font-semibold text-primary-200 ">
          <Link href="/client-dashboard">Dashboard</Link>
        </li>
        <li className="col-span-3 row-start-2 flex items-center justify-center hover:bg-primary-900 hover:text-primary-100 transition-colors gap-4 font-semibold text-primary-200 ">
          <Link href="/client-dashboard/projects">
            Projects
          </Link>
        </li>

        <li className="col-span-3 row-start-3 flex items-center justify-center hover:bg-primary-900 hover:text-primary-100 transition-colors  gap-4 font-semibold text-primary-200 ">
          <Link
            href="/client-dashboard/createProject"
            className="hover:text-accent-400 transition-colors"
          >
            <span className="text-center">
              Create New Project
            </span>
          </Link>
        </li>
        <li className="col-span-3 row-start-6 flex items-center justify-center hover:bg-primary-900 hover:text-primary-100 transition-colors  gap-4 font-semibold text-primary-200 ">
          <Link href="/client-dashboard/setting">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
