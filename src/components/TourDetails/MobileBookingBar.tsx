'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import BookingDrawerContent from "./BookingDrawerContent";

const MobileBookingBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-2xl pb-[env(safe-area-inset-bottom,0px)] transform-gpu">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">Free Booking</span>
              <p className="text-xs text-muted-foreground">Tip-Based Tour</p>
            </div>
          </div>
          <Drawer open={open} onOpenChange={setOpen} dismissible={false}>
            <DrawerTrigger asChild>
              <Button size="lg" className="flex-1 max-w-[200px] h-12 font-semibold">
                Book Now
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh] max-h-[85vh] fixed bottom-0">
              <DrawerHeader className="pb-4">
                <DrawerTitle className="sr-only">Book Your Tour</DrawerTitle>
              </DrawerHeader>
              <BookingDrawerContent onClose={() => setOpen(false)} />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default MobileBookingBar;
