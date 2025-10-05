"use client"

import * as React from "react"
// import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  // NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./ModeToggle"
import { SidebarTrigger } from "./ui/sidebar"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "./AuthContext"


export function NavigationMenuMain() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  return (
    <NavigationMenu viewport={false} className="bg-background px-2" suppressHydrationWarning>
      <NavigationMenuList>
        <NavigationMenuItem>
            <SidebarTrigger/>
        </NavigationMenuItem>
        {/* <NavigationMenuItem style={{ position: "relative" }}>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent className="absolute top-0 w-[6-vw]">
            <div className="w-[60vw] md:w-fit">
                <ul>
                    <li>
                        hi
                    </li>
                </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem className="py-2">
          <Button size={"sm"} className="mx-2 h-8" onClick={() =>{
            if(isLoggedIn){
              router.push("/Donate")
            }else{
              router.push("/Auth/Signin")
            }
            
          }}>{isLoggedIn? "Donate":"Login"}</Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ModeToggle/>
        </NavigationMenuItem>
      </NavigationMenuList>
     
    </NavigationMenu>
  )
}

// function ListItem({
//   title,
//   children,
//   href,
//   ...props
// }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
//   return (
//     <li {...props}>
//       <NavigationMenuLink asChild>
//         <Link href={href}>
//           <div className="text-sm leading-none font-medium">{title}</div>
//           <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
//             {children}
//           </p>
//         </Link>
//       </NavigationMenuLink>
//     </li>
//   )
// }
