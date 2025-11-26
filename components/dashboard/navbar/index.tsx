"use client"

import { Bars2Icon } from '@heroicons/react/24/solid'
import { Button } from '@heroui/react'
import React from 'react'
import NavDropdown from './NavDropdown'
import { SearchInput } from '@/components/reusable'

interface NavBarProps {
  setOpen: (open: boolean) => void
}

const NavBar: React.FC<NavBarProps> = ({ setOpen }) => {
  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white py-2.5 border-b border-gray-50">

      <nav className="flex basis-full items-center w-full mx-auto px-3 md:px-6">

        <div className="w-full flex items-center ml-auto justify-between sm:gap-x-3 ">

          {/*  ================= SEARCH ================= */}
          <SearchInput className='hidden lg:block' inputClassName='w-full sm:w-60 md:w-72' placeholder="Search" />

          {/*  ================= MENU BAR ICON ================= */}
          <div className="xl:hidden">
            <Button onPress={() => setOpen(true)} isIconOnly radius='full' className='text-black bg-transparent border-none'>
              <Bars2Icon className='size-5 text-black' />
            </Button>
          </div>

          <div className="flex flex-row items-center justify-end gap-x-3 md:gap-x-5">

            <NavDropdown />

          </div>

        </div>

      </nav>

    </header>
  )
}

export default NavBar