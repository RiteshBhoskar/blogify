import Link from "next/link";


export default function Footer(){
    return (
        <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2023 Blogify. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
              <Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition-colors" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition-colors" href="#">
                Privacy
              </Link>
            </nav>
          </div>
    </footer>
    )
}