"use client";

import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"; 
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (values: string[]) => void; 
  onRemove: (value: string) => void;
  value: string[]; 
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const [localUrls, setLocalUrls] = useState<string[]>(value ?? []);

 
  useEffect(() => {
    setLocalUrls(value ?? []);
  }, [value]);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const onUpload = (result: CloudinaryUploadWidgetResults) => {
   
    const info = result?.info ?? result;
    if (!info) return;

    
    const uploadedUrl = (info as { secure_url: string; url: string }).secure_url || (info as { secure_url: string; url: string }).url;
    if (!uploadedUrl) return;

    setLocalUrls((prev) => {
      
      if (prev.includes(uploadedUrl)) return prev;

      const updated = [...prev, uploadedUrl];
      onChange(updated);
      return updated;
    });
  };

  const handleRemove = (url: string) => {
    setLocalUrls((prev) => {
      const next = prev.filter((u) => u !== url);
      onChange(next);
      return next;
    });

   
    onRemove(url);
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {localUrls.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => handleRemove(url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>

      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="my_widget_preset"
        options={{
          multiple: true,
          maxFiles: 10,
          
        }}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={() => open()}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;