import logo from "../../public/assets/masterdam-logo-transparent.png";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1">
          {/* Brand */}
          <div>
            <Image src={logo} alt="Masterdam Tours" className="h-8 w-auto mb-4 object-contain" width="500" height="125" />
            <p className="text-sm text-muted-foreground">
              Discover Amsterdam with passionate local guides. Free walking tours daily!
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Masterdam Tours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
