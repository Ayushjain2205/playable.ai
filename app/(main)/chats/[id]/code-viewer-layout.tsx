"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ReactNode } from "react";

export default function CodeViewerLayout({
  children,
  isShowing,
  onClose,
}: {
  children: ReactNode;
  isShowing: boolean;
  onClose: () => void;
}) {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  return (
    <>
      {isMobile ? (
        <Drawer open={isShowing} onClose={onClose}>
          <DrawerContent>
            <VisuallyHidden.Root>
              <DrawerTitle>Code</DrawerTitle>
              <DrawerDescription>Description</DrawerDescription>
            </VisuallyHidden.Root>

            <div
              className="pixelated-code-viewer-container flex h-[90vh] flex-col overflow-y-scroll bg-white"
              style={{
                border: "0",
                boxShadow:
                  "0px 5px #0D1B52, 0px -5px #0D1B52, 5px 0px #0D1B52, -5px 0px #0D1B52, 0px 10px #0D1B5238, 5px 5px #0D1B5238, -5px 5px #0D1B5238, inset 0px 5px #ffffff36",
              }}
            >
              {children}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <div
          className={`${isShowing ? "w-1/2" : "w-0"} hidden h-full overflow-hidden py-5 transition-[width] lg:block`}
        >
          <div className="ml-4 flex h-full flex-col">
            <div
              className="pixelated-code-viewer-container flex h-full flex-col bg-white"
              style={{
                border: "0",
                boxShadow:
                  "0px 5px #0D1B52, 0px -5px #0D1B52, 5px 0px #0D1B52, -5px 0px #0D1B52, 0px 10px #0D1B5238, 5px 5px #0D1B5238, -5px 5px #0D1B5238, inset 0px 5px #ffffff36",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
