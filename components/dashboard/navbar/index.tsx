"use client"

import { Bars2Icon } from '@heroicons/react/24/solid'
import { Button, useDisclosure } from '@heroui/react'
import React from 'react'
import NavDropdown from './NavDropdown'
import { SearchInput } from '@/components/reusable'
import { BellIcon } from '@heroicons/react/24/outline'
import { PosIcon } from '@/components/icons'
import { LogoutModal, ChangePasswordModal } from '@/components/modal'

interface NavBarProps {
  setOpen: (open: boolean) => void
  showPosButton?: boolean
  root?: string
}

const NavBar: React.FC<NavBarProps> = ({ setOpen, showPosButton = true, root }) => {

  const { isOpen: isLogoutOpen, onOpen: openLogoutModal, onClose: closeLogoutModal } = useDisclosure()
  const { isOpen: isChangePasswordOpen, onOpen: openChangePasswordModal, onClose: closeChangePasswordModal } = useDisclosure()

  return (
    <>

      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white py-2.5 border-b border-gray-100">

        <nav className="flex basis-full items-center w-full mx-auto px-3 md:px-6">

          <div className="w-full flex items-center ml-auto justify-between sm:gap-x-3 ">

            {/*  ================= SEARCH ================= */}
            <SearchInput className='hidden lg:block'
              inputClassName='rounded-full w-full sm:w-60 md:w-72 bg-gray-50' placeholder="Search" />

            {/*  ================= MENU BAR ICON ================= */}
            <div className="xl:hidden">
              <Button onPress={() => setOpen(true)} isIconOnly radius='full' className='text-black bg-transparent border-none'>
                <Bars2Icon className='size-5 text-black' />
              </Button>
            </div>

            <div className="flex items-center justify-end gap-5">

              {showPosButton && (
                <Button variant='bordered' radius='sm' className='text-deep-purple 
              border-1 border-deep-purple text-xs h-9.5'>
                  <PosIcon className='size-5.5' />
                  <span className='font-medium'>POS</span>
                </Button>
              )}

              <Button isIconOnly radius='full' className='bg-gray-100 mb-0'>
                <BellIcon className='size-5 text-dark/70' />
              </Button>

              <NavDropdown openLogoutModal={openLogoutModal} openChangePasswordModal={openChangePasswordModal} root={root} />

            </div>

          </div>

        </nav>

      </header>

      <LogoutModal open={isLogoutOpen} close={closeLogoutModal} />
      <ChangePasswordModal open={isChangePasswordOpen} close={closeChangePasswordModal} />

    </>
  )
}

export default NavBar