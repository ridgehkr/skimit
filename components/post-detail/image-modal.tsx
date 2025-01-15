"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import { useState } from "react";

interface ImageModalProps {
  src: string;
  alt: string;
  redditUrl: string;
}

export function ImageModal({ src, alt, redditUrl }: ImageModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="cursor-zoom-in">
          <img 
            src={src} 
            alt={alt} 
            className="max-w-[800px] max-h-[800px] w-auto h-auto object-contain hover:opacity-95 transition-opacity" 
          />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm flex items-center justify-between">
            <AlertDialogTitle className="text-lg">
              {alt}
            </AlertDialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-contain max-h-[calc(95vh-8rem)]" 
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm flex justify-center">
            <Button variant="link" className="p-0 h-auto" asChild>
              <a 
                href={redditUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                View on Reddit
              </a>
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}