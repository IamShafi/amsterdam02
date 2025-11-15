import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import logo from "../../public/masterdam-logo-transparent.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = ({ isHomepage = false }: { isHomepage?: boolean }) => {

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur overflow-x-clip ${isHomepage ? 'bg-[hsl(30,89%,93%)]/95 supports-[backdrop-filter]:bg-[hsl(30,89%,93%)]/60' : 'bg-background/95 supports-[backdrop-filter]:bg-background/60'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between min-w-0">
          <Link href="/" className="flex items-center min-w-0">
            <Image src={logo} alt="Masterdam Tours" className="h-10 md:h-12 w-auto max-w-full" width="500" height="125" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/free-walking-tour-amsterdam" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Free Walking Tour
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-screen mr-4">
              <DropdownMenuItem asChild>
                <Link 
                  href="/free-walking-tour-amsterdam" 
                  className="w-full cursor-pointer py-3 text-base"
                >
                  Free Walking Tour
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
